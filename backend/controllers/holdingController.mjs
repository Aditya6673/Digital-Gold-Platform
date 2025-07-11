import CustomerHolding from '../models/CustomerHolding.mjs';

export const getMyHoldings = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const holdings = await CustomerHolding.find({ customerId, isDeleted: false });

    res.status(200).json(holdings);
  } catch (err) {
    next(err);
  }
};
