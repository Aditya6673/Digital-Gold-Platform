import CustomerHolding from '../models/CustomerHolding.mjs';
import GoldPrice from '../models/GoldPrice.mjs';

export const getMyHoldings = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const holdings = await CustomerHolding.find({ customerId, isDeleted: false });

    // Get current gold price for calculating current value
    const currentPriceDoc = await GoldPrice.findOne().sort({ createdAt: -1 });
    const currentPrice = currentPriceDoc?.price || 0;

    // Format holdings for frontend and filter out holdings with 0 or negative grams
    const formattedHoldings = holdings
      .filter(holding => holding.totalGrams > 0) // Only include holdings with positive grams
      .map(holding => ({
        type: 'Gold',
        quantity: holding.totalGrams || 0,
        value: (holding.totalGrams || 0) * currentPrice,
        purchaseDate: holding.lastTransactionAt 
          ? new Date(holding.lastTransactionAt).toLocaleDateString()
          : holding.createdAt 
          ? new Date(holding.createdAt).toLocaleDateString()
          : 'N/A',
        averagePricePerGram: holding.averagePricePerGram || 0,
        totalInvested: holding.totalInvested || 0
      }));

    // Calculate total portfolio value and total grams
    const totalValue = formattedHoldings.reduce((sum, holding) => sum + holding.value, 0);
    const totalGrams = formattedHoldings.reduce((sum, holding) => sum + holding.quantity, 0);

    res.status(200).json({
      holdings: formattedHoldings,
      totalValue: totalValue,
      totalGrams: totalGrams
    });
  } catch (err) {
    next(err);
  }
};
