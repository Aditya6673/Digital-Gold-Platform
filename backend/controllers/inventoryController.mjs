import GoldInventory from '../models/GoldInventory.mjs';

// ✅ Get current inventory
export const getInventory = async (req, res, next) => {
  try {
    const inventory = await GoldInventory.findOne({ isDeleted: false });
    if (!inventory) return res.status(404).json({ message: 'No inventory found' });

    res.status(200).json(inventory);
  } catch (err) {
    next(err);
  }
};

// ✅ Admin: Add grams to inventory
export const addGoldToInventory = async (req, res, next) => {
  try {
    const { grams } = parseFloat(req.body.grams);

    if (!grams || grams <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    let inventory = await GoldInventory.findOne({ isDeleted: false });

    if (!inventory) {
      inventory = await GoldInventory.create({ availableGrams: grams });
    } else {
      inventory.availableGrams += grams;
      await inventory.save();
    }
    await logAudit({
        action: 'add_inventory',
        performedBy: req.user._id,
        targetModel: 'GoldInventory',
        targetId: inventory._id,
        changes: { addedGrams: grams, newAvailableGrams: parseFloat(inventory.availableGrams.toString()) }
    });

    res.status(200).json({ message: `${grams} grams added to inventory`, inventory });
  } catch (err) {
    next(err);
  }
};

// ✅ Admin: Remove grams (e.g. for manual redemption)
export const removeGoldFromInventory = async (req, res, next) => {
  try {
    const { grams } = parseFloat(req.body.grams);

    if (!grams || grams <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const inventory = await GoldInventory.findOne({ isDeleted: false });

    if (!inventory || inventory.availableGrams < grams) {
      return res.status(400).json({ message: 'Not enough gold in inventory' });
    }

    inventory.availableGrams -= grams;
    await inventory.save();
    await logAudit({
        action: 'remove_inventory',
        performedBy: req.user._id,
        targetModel: 'GoldInventory',
        targetId: inventory._id,
        changes: { removedGrams: grams, newAvailableGrams: parseFloat(inventory.availableGrams.toString()) }
    });

    res.status(200).json({ message: `${grams} grams removed from inventory`, inventory });
  } catch (err) {
    next(err);
  }
};
