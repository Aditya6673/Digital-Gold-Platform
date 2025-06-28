import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.mjs';

// Import Mongoose models
import User from '../models/User.mjs';
import Shopkeeper from '../models/Shopkeeper.mjs';
import GoldPriceFeed from '../models/GoldPriceFeed.mjs';
import ShopkeeperPricing from '../models/ShopkeeperPricing.mjs';
import GoldInventory from '../models/GoldInventory.mjs';

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    // Clear old data
    await User.deleteMany();
    await Shopkeeper.deleteMany();
    await GoldPriceFeed.deleteMany();
    await ShopkeeperPricing.deleteMany();
    await GoldInventory.deleteMany();

    // Create one shopkeeper user
    const shopkeeperUser = await User.create({
      name: 'Ramesh Goldwala',
      email: 'ramesh@goldwala.com',
      phone: '9998887770',
      passwordHash: 'hashedpassword123',
      role: 'shopkeeper',
      createdAt: new Date(),
    });

    // Create Shopkeeper profile
    const shopkeeper = await Shopkeeper.create({
      userId: shopkeeperUser._id,
      shopName: 'Golden Era Jewels',
      address: {
        line: 'Main Bazar, Karol Bagh',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110005',
      },
      gstNumber: '07ABCDE1234F1Z5',
    });

    // Create global gold price
    const goldFeed = await GoldPriceFeed.create({
      pricePerGram: 5850,
      currency: 'INR',
      source: 'MCX',
      updatedAt: new Date(),
    });

    // Shopkeeper's pricing
    const pricing = await ShopkeeperPricing.create({
      shopkeeperId: shopkeeper._id,
      marginPerGram: 150,
      pricePerGram: 6000,
      lastSyncedWithFeed: new Date(),
    });

    // Shopkeeper's inventory
    const inventory = await GoldInventory.create({
      shopkeeperId: shopkeeper._id,
      availableGrams: 250.5,
      realTimePriceRef: goldFeed._id,
      marginPerGram: 150,
      finalSellingPrice: 6000,
      lastUpdated: new Date(),
    });

    console.log('✅ Test data seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding test data:', err.message);
    process.exit(1);
  }
};

seedData();
