import RedemptionRequest from '../models/RedemptionRequest.mjs';
import CustomerHolding from '../models/CustomerHolding.mjs';

export const requestRedemption = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { shopkeeperId, grams } = req.body;

    if (!grams || grams <= 0) {
      return res.status(400).json({ message: 'Invalid redemption amount' });
    }

    const holding = await CustomerHolding.findOne({ customerId, shopkeeperId, isDeleted: false });

    if (!holding || holding.grams < grams) {
      return res.status(400).json({ message: 'Insufficient gold balance' });
    }

    const request = await RedemptionRequest.create({
      customerId,
      shopkeeperId,
      grams,
      status: 'pending',
      isDeleted: false
    });

    res.status(201).json({ message: 'Redemption request submitted', request });
  } catch (err) {
    next(err);
  }
};

export const getMyRedemptionRequests = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const requests = await RedemptionRequest.find({ customerId, isDeleted: false });
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

export const getShopkeeperRedemptionRequests = async (req, res, next) => {
  try {
    const shopkeeperId = req.user.id;
    const requests = await RedemptionRequest.find({ shopkeeperId, isDeleted: false });
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

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

    if (!request) return res.status(404).json({ message: 'Redemption request not found' });

    // If approved, subtract grams from holding
    if (status === 'approved') {
      const holding = await CustomerHolding.findOne({
        customerId: request.customerId,
        shopkeeperId: request.shopkeeperId,
        isDeleted: false
      });

      if (!holding || holding.grams < request.grams) {
        return res.status(400).json({ message: 'Insufficient holding at approval time' });
      }

      holding.grams -= request.grams;
      await holding.save();
    }

    res.status(200).json({ message: `Request ${status}`, request });
  } catch (err) {
    next(err);
  }
};
