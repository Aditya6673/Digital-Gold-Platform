import CustomerHolding from '../models/CustomerHolding.mjs';
import Shopkeeper from '../models/shopkeeper.mjs';

export const getMyHoldings = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const holdings = await CustomerHolding.find({ customerId, isDeleted: false })
      .populate({ path: 'shopkeeperId', select: 'shopName address', model: Shopkeeper });

    res.status(200).json(holdings);
  } catch (err) {
    next(err);
  }
};

export const getHoldingByShopkeeper = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { shopkeeperId } = req.params;

    const holding = await CustomerHolding.findOne({
      customerId,
      shopkeeperId,
      isDeleted: false
    });

    if (!holding) return res.status(404).json({ message: 'No holding found' });
    res.status(200).json(holding);
  } catch (err) {
    next(err);
  }
};
