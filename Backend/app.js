require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const connectDB = require("./config/database");
const Student = require("./models/Student");
const Certificate = require("./models/Certificate");
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Student Hub Dashboard - Please use the frontend application");
});

app.get("/dashboard", (req, res) => {
  res.json({
    message: "Dashboard endpoint - use frontend for full dashboard experience",
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

app.post("/api/register", async (req, res) => {
  try {
    console.log("Registration request:", req.body);
    const { password, confirmPassword, ...studentData } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ ...studentData, password: hashedPassword });

    console.log("Saving student:", student);
    await student.save();
    res.status(201).json({
      message: "Student registered successfully",
      studentId: student.studentId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      studentId: student.studentId,
      name: student.name,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/certificates", upload.single("image"), async (req, res) => {
  try {
    console.log('Certificate request received:', req.body);
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    const certificateData = {
      name: req.body.name,
      image: req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`
        : req.body.image,
      url: req.body.url,
      date: req.body.date,
      category: req.body.category,
      issuer: req.body.issuer,
    };

    const student = await Student.findOne({ studentId: req.body.studentId });
    if (!student) {
      console.log('Student not found:', req.body.studentId);
      return res.status(404).json({ error: "Student not found" });
    }

    student.personalCertificates.push(certificateData);
    await student.save();
    console.log('Certificate saved successfully');

    res
      .status(201)
      .json({
        message: "Certificate added successfully",
        certificate: certificateData,
      });
  } catch (error) {
    console.error('Certificate error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/certificates/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student.personalCertificates || []);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
