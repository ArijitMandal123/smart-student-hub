require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const connectDB = require('./config/database');
const Student = require('./models/Student');
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Student Hub Dashboard - Please use the frontend application');
});

app.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard endpoint - use frontend for full dashboard experience' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});

app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    const { password, confirmPassword, ...studentData } = req.body;
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ ...studentData, password: hashedPassword });
    
    console.log('Saving student:', student);
    await student.save();
    res.status(201).json({ 
      message: 'Student registered successfully', 
      studentId: student.studentId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    res.json({ 
      message: 'Login successful', 
      studentId: student.studentId,
      name: student.name 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});