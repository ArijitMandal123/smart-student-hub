require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./models/Student');

const seedStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testStudents = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        college: 'MIT College of Engineering',
        department: 'Computer Science',
        year: 3,
        semester: 6,
        rollNumber: 'CS2021001',
        studentId: 'RIOITIxV20p', // Your specific student ID
        profile: {
          profileImage: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=JD',
          mobileNumber: '9876543210',
          currentSGPA: 8.5,
          overallCGPA: 8.2
        },
        cgpa: 8.2
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        college: 'Stanford University',
        department: 'Information Technology',
        year: 2,
        semester: 4,
        rollNumber: 'IT2022015',
        profile: {
          profileImage: 'https://via.placeholder.com/150/10B981/FFFFFF?text=JS',
          mobileNumber: '9876543211',
          currentSGPA: 9.1,
          overallCGPA: 8.9
        },
        cgpa: 8.9
      },
      {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        password: hashedPassword,
        college: 'Harvard University',
        department: 'Electrical Engineering',
        year: 4,
        semester: 8,
        rollNumber: 'EE2020025',
        profile: {
          profileImage: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=AJ',
          mobileNumber: '9876543212',
          currentSGPA: 7.8,
          overallCGPA: 8.0
        },
        cgpa: 8.0
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: hashedPassword,
        college: 'MIT College of Engineering',
        department: 'Mechanical Engineering',
        year: 1,
        semester: 2,
        rollNumber: 'ME2023010',
        profile: {
          profileImage: 'https://via.placeholder.com/150/EF4444/FFFFFF?text=SW',
          mobileNumber: '9876543213',
          currentSGPA: 8.7,
          overallCGPA: 8.7
        },
        cgpa: 8.7
      }
    ];
    
    // Clear existing test students
    await Student.deleteMany({ email: { $in: testStudents.map(s => s.email) } });
    
    // Insert new test students
    for (const studentData of testStudents) {
      const student = new Student(studentData);
      await student.save();
      console.log(`Student created: ${student.name} (ID: ${student.studentId})`);
    }
    
    console.log('Test students seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding students:', error.message);
    process.exit(1);
  }
};

seedStudents();