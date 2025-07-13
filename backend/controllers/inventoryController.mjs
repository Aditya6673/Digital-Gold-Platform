import GoldInventory from '../models/GoldInventory.mjs';
import { logAudit } from '../utils/logAudit.mjs';

// ✅ Get current inventory
export const getInventory = async (req, res, next) => {
  try {
    const inventory = await GoldInventory.findOne({ isDeleted: false });
    if (!inventory) return res.status(404).json({ message: 'No inventory found' });

    // Ensure availableGrams is a number
    const availableGrams = parseFloat(inventory.availableGrams.toString());
    res.status(200).json({ ...inventory.toObject(), availableGrams });
  } catch (err) {
    next(err);
  }
};

// ✅ Admin: Update inventory (increase or decrease)
export const updateInventory = async (req, res, next) => {
  try {
    const { grams, operation } = req.body;

    if (!grams || grams <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    if (!['add', 'remove'].includes(operation)) {
      return res.status(400).json({ message: 'Invalid operation. Use "add" or "remove"' });
    }

    let inventory = await GoldInventory.findOne({ isDeleted: false });

    if (!inventory) {
      if (operation === 'remove') {
        return res.status(400).json({ message: 'No inventory exists to remove from' });
      }
      inventory = await GoldInventory.create({ availableGrams: grams });
    } else {
      if (operation === 'remove' && inventory.availableGrams < grams) {
        return res.status(400).json({ message: 'Not enough gold in inventory' });
      }

      if (operation === 'add') {
        inventory.availableGrams += grams;
      } else {
        inventory.availableGrams -= grams;
      }
      await inventory.save();
    }

    const action = operation === 'add' ? 'add_inventory' : 'remove_inventory';
    const changeKey = operation === 'add' ? 'addedGrams' : 'removedGrams';
    
    await logAudit({
      action,
      performedBy: req.user._id,
      targetModel: 'GoldInventory',
      targetId: inventory._id,
      changes: { 
        [changeKey]: grams, 
        newAvailableGrams: parseFloat(inventory.availableGrams.toString()) 
      }
    });

    const message = operation === 'add' 
      ? `${grams} grams added to inventory` 
      : `${grams} grams removed from inventory`;

    // Ensure availableGrams is a number in the response
    const availableGrams = parseFloat(inventory.availableGrams.toString());
    res.status(200).json({ 
      message, 
      inventory: { ...inventory.toObject(), availableGrams },
      operation,
      gramsChanged: grams,
      newTotal: availableGrams
    });
  } catch (err) {
    next(err);
  }
};
