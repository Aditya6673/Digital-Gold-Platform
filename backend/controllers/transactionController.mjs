// 💰 Gold Transaction Controller (minor formatting only - logic unchanged)
import mongoose from "mongoose";
import User from "../models/User.mjs";
import GoldInventory from "../models/GoldInventory.mjs";
import Transaction from "../models/Transaction.mjs";
import CustomerHolding from "../models/CustomerHolding.mjs";
import { notifyUser } from "../utils/notifyUser.mjs";
import { logAudit } from "../utils/logAudit.mjs";
import { getCurrentPriceFromDB } from "../controllers/goldPriceController.mjs";

export const buyGold = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerId = req.user.id;
    const { grams } = req.body;

    // ✅ Validate input grams
    if (!grams || grams <= 0) {
      throw new Error("Invalid gold quantity");
    }

    // ✅ Ensure user has verified KYC
    const user = await User.findById(customerId).session(session);
    if (!user || !user.kyc?.verified) {
      throw new Error("KYC not verified. Cannot proceed with purchase.");
    }

    // ✅ Fetch current gold price (per gram) from database
    const pricePerGram = await getCurrentPriceFromDB();
    const totalAmount = parseFloat((pricePerGram * grams).toFixed(2));

    // ✅ Check gold inventory
    const inventory = await GoldInventory.findOne({ isDeleted: false }).session(session);
    if (!inventory || inventory.availableGrams < grams) {
      throw new Error("Insufficient gold inventory");
    }

    // ✅ Create new transaction record
    const [transaction] = await Transaction.create(
      [
        {
          customerId,
          type: "buy",
          grams,
          pricePerGram,
          totalAmount,
          transactionTime: new Date(),
        },
      ],
      { session }
    );

    // ✅ Update or create customer's gold holding
    let holding = await CustomerHolding.findOne({
      customerId,
      isDeleted: false,
    }).session(session);

    if (holding) {
      const totalGrams = holding.totalGrams + grams;
      const weightedAvg =
        (holding.totalGrams * holding.averagePricePerGram + totalAmount) / totalGrams;

      holding.totalGrams = parseFloat(totalGrams.toFixed(4));
      holding.averagePricePerGram = parseFloat(weightedAvg.toFixed(2));

      await holding.save({ session });
    } else {
      await CustomerHolding.create(
        [
          {
            customerId,
            totalGrams: parseFloat(grams.toFixed(4)),
            averagePricePerGram: pricePerGram,
            isDeleted: false,
          },
        ],
        { session }
      );
    }

    // ✅ Deduct inventory
    inventory.availableGrams -= grams;
    await inventory.save({ session });

    // ✅ Notify user & log audit entry
    await notifyUser(customerId, `You purchased ${grams} grams of gold for ₹${totalAmount}.`);
    await logAudit({
      action: "buy_gold",
      performedBy: customerId,
      targetModel: "Transaction",
      targetId: transaction._id,
      changes: { grams, totalAmount },
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Gold purchase successful",
      transaction,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const sellGold = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customerId = req.user.id;
    const { grams } = req.body;

    // ✅ Validate grams
    if (!grams || grams <= 0) throw new Error("Invalid gold quantity");

    // ✅ Verify KYC before selling
    const user = await User.findById(customerId).session(session);
    if (!user || !user.kyc?.verified) {
      throw new Error("KYC not verified. Cannot proceed with sale.");
    }

    // ✅ Check user’s current holdings
    let holding = await CustomerHolding.findOne({
      customerId,
      isDeleted: false,
    }).session(session);

    if (!holding || holding.totalGrams < grams) {
      throw new Error("Insufficient gold balance to sell");
    }

    // ✅ Fetch current gold price from database
    const pricePerGram = await getCurrentPriceFromDB();
    const totalAmount = parseFloat((pricePerGram * grams).toFixed(2));

    // ✅ Record the sell transaction
    const [transaction] = await Transaction.create(
      [
        {
          customerId,
          type: "sell",
          grams,
          pricePerGram,
          totalAmount,
          status: "success",
          createdAt: new Date(),
        },
      ],
      { session }
    );

    // ✅ Update holdings after sale
    holding.totalGrams = parseFloat((holding.totalGrams - grams).toFixed(4));
    holding.lastTransactionAt = new Date();
    await holding.save({ session });

    // ✅ Add sold gold back to inventory
    let inventory = await GoldInventory.findOne({ isDeleted: false }).session(session);
    if (!inventory) {
      inventory = await GoldInventory.create([{ availableGrams: grams }], { session });
    } else {
      inventory.availableGrams += grams;
      await inventory.save({ session });
    }

    // ✅ Notify & audit
    await notifyUser(customerId, `You sold ${grams} grams of gold for ₹${totalAmount}.`);
    await logAudit({
      action: "sell_gold",
      performedBy: customerId,
      targetModel: "Transaction",
      targetId: transaction._id,
      changes: { grams, totalAmount },
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Gold sale successful",
      transaction,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    // 🧾 Fetch user’s transaction history
    const transactions = await Transaction.find({ customerId }).sort({
      transactionTime: -1,
    });

    res.status(200).json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
};
