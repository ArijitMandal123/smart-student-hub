require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Seed new admin
    const newAdmin = new Admin({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: hashedPassword,
      institution: 'Test Institution',
      role: 'Super Admin'
    });
    
    await newAdmin.save();
    console.log('New admin added with ID:', newAdmin.adminId);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedData();