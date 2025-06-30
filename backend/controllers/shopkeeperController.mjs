import GoldInventory from '../models/GoldInventory.mjs';
import { notifyUser } from '../utils/notifyUser.mjs';
import { logAudit } from '../utils/logAudit.mjs';

// Add or update inventory
export const updateInventory = async (req, res, next) => {
  try {
    const { availableGrams, marginPerGram } = req.body;

    const basePrice = req.basePrice; // You must extract this earlier if needed

    const finalSellingPrice = basePrice + marginPerGram;

    let inventory = await GoldInventory.findOne({ shopkeeperId: req.user._id, isDeleted: false });

    if (inventory) {
      inventory.availableGrams = availableGrams;
      inventory.marginPerGram = marginPerGram;
      inventory.finalSellingPrice = finalSellingPrice;
      inventory.lastUpdated = new Date();
      await inventory.save();

      // 📜 Log Audit
      await logAudit({
        action: 'update',
        performedBy: req.user._id,
        targetModel: 'GoldInventory',
        targetId: inventory._id,
        changes: { availableGrams, marginPerGram, finalSellingPrice }
      });

      // 🔔 Low inventory notification
      if (availableGrams < 5) {
        await notifyUser(req.user._id, `⚠️ Low inventory alert: Only ${availableGrams}g remaining.`);
      }

    } else {
      inventory = await GoldInventory.create({
        shopkeeperId: req.user._id,
        availableGrams,
        marginPerGram,
        finalSellingPrice,
        lastUpdated: new Date()
      });

      // 📜 Log creation as audit
      await logAudit({
        action: 'create',
        performedBy: req.user._id,
        targetModel: 'GoldInventory',
        targetId: inventory._id,
        changes: { availableGrams, marginPerGram, finalSellingPrice }
      });
    }

    res.status(200).json(inventory);
  } catch (err) {
    next(err);
  }
};

// Get shopkeeper's inventory
export const getInventory = async (req, res, next) => {
  try {
    const inventory = await GoldInventory.findOne({ shopkeeperId: req.user._id, isDeleted: false });
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.status(200).json(inventory);
  } catch (err) {
    next(err);
  }
};

// Soft delete inventory
export const deleteInventory = async (req, res, next) => {
  try {
    const inventory = await GoldInventory.findOneAndUpdate(
      { shopkeeperId: req.user._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!inventory) return res.status(404).json({ message: 'No inventory found to delete' });

    // 📜 Audit log
    await logAudit({
      action: 'delete',
      performedBy: req.user._id,
      targetModel: 'GoldInventory',
      targetId: inventory._id
    });

    res.status(200).json({ message: 'Inventory deleted successfully' });
  } catch (err) {
    next(err);
  }
};
