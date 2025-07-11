import mongoose from 'mongoose';
import User from '../models/User.mjs';
import GoldInventory from '../models/GoldInventory.mjs';
import Transaction from '../models/Transaction.mjs';
import CustomerHolding from '../models/CustomerHolding.mjs';
import { notifyUser } from '../utils/notifyUser.mjs';
import { logAudit } from '../utils/logAudit.mjs';
import { fetchGoldPriceInINR } from '../utils/fetchGoldPrice.mjs';

export const buyGold = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerId = req.user.id;
    const { grams } = req.body;

    // ✅ Validate grams
    if (!grams || grams <= 0) {
      throw new Error('Invalid gold quantity');
    }

    // ✅ Check KYC
    const user = await User.findById(customerId).session(session);
    if (!user || !user.kyc?.verified) {
      throw new Error('KYC not verified. Cannot proceed with purchase.');
    }

    // ✅ Get live gold price
    const pricePerGram = await fetchGoldPriceInINR();
    const totalAmount = parseFloat((pricePerGram * grams).toFixed(2));

    // ✅ Check inventory
    const inventory = await GoldInventory.findOne({ isDeleted: false }).session(session);
    if (!inventory || inventory.availableGrams < grams) {
      throw new Error('Insufficient gold inventory');
    }

    // ✅ Create transaction
    const [transaction] = await Transaction.create([{
      customerId,
      type: 'buy',
      grams,
      pricePerGram,
      totalAmount,
      transactionTime: new Date()
    }], { session });

    // ✅ Update or create holding
    let holding = await CustomerHolding.findOne({
      customerId,
      isDeleted: false
    }).session(session);

    if (holding) {
      const totalGrams = holding.grams + grams;
      const weightedAvg = ((holding.grams * holding.averagePricePerGram) + totalAmount) / totalGrams;

      holding.grams = parseFloat(totalGrams.toFixed(4));
      holding.averagePricePerGram = parseFloat(weightedAvg.toFixed(2));

      await holding.save({ session });
    } else {
      await CustomerHolding.create([{
        customerId,
        grams: parseFloat(grams.toFixed(4)),
        averagePricePerGram: pricePerGram,
        isDeleted: false
      }], { session });
    }

    // ✅ Update inventory
    inventory.availableGrams -= grams;
    await inventory.save({ session });

    // ✅ Notify user and audit log
    await notifyUser(customerId, `You purchased ${grams} grams of gold for ₹${totalAmount}.`);
    await logAudit({
      action: 'buy_gold',
      performedBy: customerId,
      targetModel: 'Transaction',
      targetId: transaction._id,
      changes: { grams, totalAmount }
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Gold purchase successful',
      transaction
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
