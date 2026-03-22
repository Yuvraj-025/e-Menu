require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await MenuItem.deleteMany();

    // Create admin user
    const adminUser = new User({
      email: 'admin@cafe.com',
      password: 'AdminUser123!' // will be hashed by pre-save hook
    });
    await adminUser.save();
    console.log('Admin user created: admin@cafe.com / AdminUser123!');

    // Read menu.json from original directory
    const menuPath = path.join(__dirname, '../menu.json');
    if (fs.existsSync(menuPath)) {
      const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
      
      // Clean data for new schema
      const cleanedItems = menuData.map(item => ({
        name: item.name,
        category: item.category,
        description: item.description || 'Delicious cafe item',
        price: Number(item.price) || 0,
        image: item.image || 'assets/default.png'
      }));

      await MenuItem.insertMany(cleanedItems);
      console.log(`Successfully seeded ${cleanedItems.length} menu items`);
    } else {
      console.log('menu.json not found. Skipping menu item seeding.');
    }

    console.log('Database seeding completed successfully ✅');
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedData();
