import mongoose from 'mongoose';
import Transaction from '../models/Transaction.mjs';
import CustomerHolding from '../models/CustomerHolding.mjs';
import ShopkeeperPricing from '../models/ShopkeeperPricing.mjs';
import GoldInventory from '../models/GoldInventory.mjs';
import { notifyUser } from '../utils/notifyUser.mjs';
import { logAudit } from '../utils/logAudit.mjs';

export const buyGold = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerId = req.user.id;
    const { shopkeeperId, grams } = req.body;

    const pricing = await ShopkeeperPricing.findOne({ shopkeeperId }).session(session);
    const inventory = await GoldInventory.findOne({ shopkeeperId, isDeleted: false }).session(session);

    if (!pricing || !inventory || inventory.availableGrams < grams) {
      throw new Error('Inventory or pricing not found or insufficient gold');
    }

    const pricePerGram = pricing.pricePerGram;
    const totalAmount = parseFloat((pricePerGram * grams).toFixed(2));

    const transaction = await Transaction.create([{
      customerId,
      shopkeeperId,
      type: 'buy',
      grams,
      pricePerGram,
      totalAmount,
      transactionTime: new Date()
    }], { session });

    const holding = await CustomerHolding.findOne({
      customerId,
      shopkeeperId,
      isDeleted: false
    }).session(session);

    if (holding) {
      const totalGrams = holding.grams + grams;
      const weightedAvg = ((holding.grams * holding.averagePricePerGram) + totalAmount) / totalGrams;
      holding.grams = totalGrams;
      holding.averagePricePerGram = parseFloat(weightedAvg.toFixed(2));
      await holding.save({ session });
    } else {
      await CustomerHolding.create([{
        customerId,
        shopkeeperId,
        grams,
        averagePricePerGram: pricePerGram
      }], { session });
    }

    inventory.availableGrams -= grams;
    await inventory.save({ session });
    await notifyUser(req.user._id, `Purchased ${grams} grams of gold for ₹${totalAmount}.`);
    // Log the transaction
    await logAudit({
      action: 'buy_gold',
      performedBy: req.user._id,
      targetModel: 'Transaction',
      targetId: transaction[0]._id,
      changes: { grams, totalAmount }
    });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Gold purchased', transaction: transaction[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ customerId: req.user._id });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};
