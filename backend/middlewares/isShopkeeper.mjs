export const isShopkeeper = (req, res, next) => {
  if (req.user?.role !== 'shopkeeper') {
    return res.status(403).json({ message: 'Access denied: Shopkeepers only' });
  }
  next();
};
