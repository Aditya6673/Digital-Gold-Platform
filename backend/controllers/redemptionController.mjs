import RedemptionRequest from '../models/RedemptionRequest.mjs';
import CustomerHolding from '../models/CustomerHolding.mjs';
import { notifyUser } from '../utils/notifyUser.mjs';
import { logAudit } from '../utils/logAudit.mjs';

// ⛏ Create new redemption request
export const requestRedemption = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { grams } = req.body;

    if (!grams || grams <= 0) {
      return res.status(400).json({ message: 'Invalid redemption amount' });
    }

    const holding = await CustomerHolding.findOne({ customerId, isDeleted: false });

    if (!holding || holding.grams < grams) {
      return res.status(400).json({ message: 'Insufficient gold balance' });
    }

    const request = await RedemptionRequest.create({
      customerId,
      grams,
      status: 'pending',
      isDeleted: false
    });

    res.status(201).json({ message: 'Redemption request submitted', request });
  } catch (err) {
    next(err);
  }
};

// 📋 Get all redemption requests by this user
export const getMyRedemptionRequests = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const requests = await RedemptionRequest.find({ customerId, isDeleted: false });
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

// ✅ [Optional Admin-Only] View all redemption requests
export const getAllRedemptionRequests = async (req, res, next) => {
  try {
    const requests = await RedemptionRequest.find({ isDeleted: false });
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

// ✅ Update request status: approve or reject
export const updateRedemptionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await RedemptionRequest.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { status },
      { new: true }
    );

    if (!request || request.isDeleted) {
      return res.status(404).json({ message: 'Redemption request not found' });
    }

    if (status === 'approved') {
      const holding = await CustomerHolding.findOne({
        customerId: request.customerId,
        isDeleted: false
      });

      if (!holding || holding.grams < request.grams) {
        return res.status(400).json({ message: 'Insufficient holding at approval time' });
      }

      holding.grams -= request.grams;
      await holding.save();

      await notifyUser(request.customerId, `Your redemption request of ${request.grams} grams has been approved.`);
      await logAudit({
        action: 'approve_redemption',
        performedBy: req.user._id,
        targetModel: 'RedemptionRequest',
        targetId: request._id,
        changes: { status }
      });
    }

    res.status(200).json({ message: `Request ${status}`, request });
  } catch (err) {
    next(err);
  }
};
