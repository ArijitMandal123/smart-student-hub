require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./models/Student');

const seedNewStudent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newStudent = new Student({
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: hashedPassword,
      college: 'Delhi College of Engineering',
      department: 'Mechanical Engineering',
      year: 1,
      semester: 2,
      rollNumber: 'ME2023001'
    });
    
    await newStudent.save();
    console.log('New student added with ID:', newStudent.studentId);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedNewStudent();