require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const connectDB = require("./config/database");
const Student = require("./models/Student");
const Certificate = require("./models/Certificate");
const Teacher = require("./models/Teacher");
const Admin = require("./models/Admin");
const College = require("./models/College");
const Group = require("./models/Group");
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

app.post("/api/test-admin", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const admin = new Admin({
      name: 'Test Frontend Admin',
      email: 'frontendtest@example.com',
      password: hashedPassword,
      institution: 'Test Institution',
      role: 'Super Admin'
    });
    await admin.save();
    res.json({ message: 'Test admin created', adminId: admin.adminId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/test-teacher", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const teacher = new Teacher({
      name: 'Test Teacher',
      email: 'test@test.com',
      password: hashedPassword,
      phoneNumber: '1234567890',
      department: 'Test Department',
      college: 'Test College',
      designation: 'Assistant Professor',
      experience: 5
    });
    await teacher.save();
    res.json({ message: 'Test teacher created', teacherId: teacher.teacherId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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

// Teacher endpoints
app.post("/api/teacher/register", async (req, res) => {
  try {
    console.log('=== TEACHER REGISTRATION DEBUG ===');
    console.log('Raw request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers['content-type']);
    
    const { password, confirmPassword, experience, ...teacherData } = req.body;
    
    console.log('Extracted data:');
    console.log('- password length:', password?.length);
    console.log('- confirmPassword length:', confirmPassword?.length);
    console.log('- experience:', experience, typeof experience);
    console.log('- teacherData:', JSON.stringify(teacherData, null, 2));

    if (password !== confirmPassword) {
      console.log('Password mismatch error');
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacherPayload = { 
      ...teacherData, 
      password: hashedPassword,
      experience: parseInt(experience) || 0
    };
    
    console.log('Final teacher payload:', JSON.stringify(teacherPayload, null, 2));
    const teacher = new Teacher(teacherPayload);

    console.log('Teacher model created, attempting save...');
    await teacher.save();
    console.log('Teacher saved successfully with ID:', teacher.teacherId);
    
    res.status(201).json({
      message: "Teacher registered successfully",
      teacherId: teacher.teacherId,
      name: teacher.name,
    });
  } catch (error) {
    console.error('=== TEACHER REGISTRATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/teacher/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, teacher.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      teacherId: teacher.teacherId,
      name: teacher.name,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin endpoints
app.post("/api/admin/register", async (req, res) => {
  try {
    console.log('=== ADMIN REGISTRATION DEBUG ===');
    console.log('Raw request body:', JSON.stringify(req.body, null, 2));
    
    const { password, confirmPassword, ...adminData } = req.body;
    
    console.log('Extracted data:');
    console.log('- password length:', password?.length);
    console.log('- confirmPassword length:', confirmPassword?.length);
    console.log('- adminData:', JSON.stringify(adminData, null, 2));
    
    if (password !== confirmPassword) {
      console.log('Password mismatch error');
      return res.status(400).json({ error: "Passwords do not match" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminPayload = { ...adminData, password: hashedPassword };
    
    console.log('Final admin payload:', JSON.stringify(adminPayload, null, 2));
    const admin = new Admin(adminPayload);
    
    console.log('Admin model created, attempting save...');
    await admin.save();
    console.log('Admin saved with institution:', admin.institution, 'department:', admin.department);
    
    // Create college with department
    try {
      const existingCollege = await College.findOne({ name: admin.institution });
      if (!existingCollege) {
        const collegeCode = admin.institution.replace(/\s+/g, '').substring(0, 6).toUpperCase();
        const deptCode = admin.department.replace(/\s+/g, '').substring(0, 4).toUpperCase();
        
        const collegeData = {
          name: admin.institution,
          code: collegeCode,
          address: 'Not specified',
          departments: [{
            name: admin.department,
            code: deptCode
          }],
          createdBy: admin.adminId
        };
        
        console.log('Creating college with data:', JSON.stringify(collegeData, null, 2));
        const newCollege = new College(collegeData);
        await newCollege.save();
        console.log('College saved successfully:', newCollege._id);
      }
    } catch (collegeError) {
      console.error('College creation error:', collegeError.message);
    }
    
    res.status(201).json({ 
      message: "Admin registered successfully", 
      adminId: admin.adminId, 
      name: admin.name,
      institution: admin.institution,
      department: admin.department
    });
  } catch (error) {
    console.error('=== ADMIN REGISTRATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    res.json({ 
      message: "Login successful", 
      adminId: admin.adminId, 
      name: admin.name,
      institution: admin.institution,
      department: admin.department
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// College management endpoints
app.post("/api/colleges", async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json({ message: "College created successfully", college });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/colleges", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/colleges/:collegeId/departments", async (req, res) => {
  try {
    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    college.departments.push(req.body);
    await college.save();
    res.status(201).json({ message: "Department added successfully", college });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/admin/students", async (req, res) => {
  try {
    const students = await Student.find({}, '-password');
    res.json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/admin/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find({}, '-password');
    res.json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/groups", async (req, res) => {
  try {
    console.log('Group creation request:', JSON.stringify(req.body, null, 2));
    const group = new Group(req.body);
    await group.save();
    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error('Group creation error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/groups/:adminId", async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.params.adminId });
    res.json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/teacher/groups/:teacherId", async (req, res) => {
  try {
    const groups = await Group.find({ teacher: req.params.teacherId });
    res.json(groups);
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



app.delete("/api/certificates/:studentId/:certificateId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    student.personalCertificates.pull({ _id: req.params.certificateId });
    await student.save();
    
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Project endpoints
app.post("/api/projects", async (req, res) => {
  try {
    const { studentId, title, description, githubLink, deployLink } = req.body;
    
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const projectData = {
      title,
      description,
      githubLink,
      deployLink: deployLink || null,
      createdAt: new Date()
    };

    student.projects.push(projectData);
    await student.save();

    res.status(201).json({ message: "Project added successfully", project: projectData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/projects/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student.projects || []);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/projects/:studentId/:projectId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    student.projects.pull({ _id: req.params.projectId });
    await student.save();
    
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/profile/:studentId", upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'class10Certificate', maxCount: 1 },
  { name: 'class12Certificate', maxCount: 1 },
  { name: 'diplomaCertificate', maxCount: 1 },
  { name: 'bachelorDegree', maxCount: 1 },
  { name: 'masterDegree', maxCount: 1 },
  { name: 'doctorDegree', maxCount: 1 }
]), async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    const profileData = { ...req.body };
    
    // Handle file uploads
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        const file = req.files[fieldName][0];
        profileData[fieldName] = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      });
    }
    
    // Handle array fields
    if (profileData.skills && typeof profileData.skills === 'string') {
      profileData.skills = profileData.skills.split(',').map(s => s.trim());
    }
    if (profileData.languages && typeof profileData.languages === 'string') {
      profileData.languages = profileData.languages.split(',').map(l => l.trim());
    }
    if (profileData.hobbies && typeof profileData.hobbies === 'string') {
      profileData.hobbies = profileData.hobbies.split(',').map(h => h.trim());
    }
    
    student.profile = { ...student.profile, ...profileData };
    await student.save();
    
    res.json({ message: "Profile updated successfully", profile: student.profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/profile/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student.profile || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId }, '-password');
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/students/:studentId/marks", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId }, 'semesterMarks cgpa');
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({
      semesterMarks: student.semesterMarks || [],
      cgpa: student.cgpa || 0
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/students/:studentId/marks", async (req, res) => {
  try {
    console.log('=== MARKS ENTRY DEBUG ===');
    console.log('Student ID:', req.params.studentId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { semester, year, sgpa, subjects } = req.body;
    
    // Validate required fields
    if (!semester || !year || !sgpa) {
      console.log('Missing required fields:', { semester, year, sgpa });
      return res.status(400).json({ error: "Semester, year, and SGPA are required" });
    }
    
    if (isNaN(semester) || isNaN(year) || isNaN(sgpa)) {
      console.log('Invalid number values:', { semester, year, sgpa });
      return res.status(400).json({ error: "Semester, year, and SGPA must be valid numbers" });
    }
    
    const student = await Student.findOne({ studentId: req.params.studentId });
    
    if (!student) {
      console.log('Student not found with ID:', req.params.studentId);
      return res.status(404).json({ error: "Student not found" });
    }
    
    console.log('Student found:', student.name);
    console.log('Current semesterMarks length:', student.semesterMarks?.length || 0);
    
    // Check if marks for this semester/year already exist
    const existingRecord = student.semesterMarks.find(mark => 
      mark.semester === parseInt(semester) && mark.year === parseInt(year)
    );
    
    if (existingRecord) {
      return res.status(400).json({ error: "Marks for this semester and year already exist" });
    }
    
    const marksRecord = {
      semester: parseInt(semester),
      year: parseInt(year),
      sgpa: parseFloat(sgpa),
      subjects: subjects ? subjects.map(sub => ({
        name: sub.name,
        marks: parseInt(sub.marks),
        grade: sub.grade
      })) : []
    };
    
    console.log('Marks record to add:', marksRecord);
    
    // Initialize semesterMarks array if it doesn't exist
    if (!student.semesterMarks) {
      student.semesterMarks = [];
    }
    
    student.semesterMarks.push(marksRecord);
    
    // Calculate and update CGPA
    const totalSGPA = student.semesterMarks.reduce((sum, record) => sum + record.sgpa, 0);
    student.cgpa = parseFloat((totalSGPA / student.semesterMarks.length).toFixed(2));
    
    console.log('New CGPA calculated:', student.cgpa);
    console.log('Updated semesterMarks length:', student.semesterMarks.length);
    
    // Mark the document as modified
    student.markModified('semesterMarks');
    student.markModified('cgpa');
    
    const savedStudent = await student.save();
    console.log('Student saved successfully. Final semesterMarks:', savedStudent.semesterMarks.length);
    console.log('Final CGPA:', savedStudent.cgpa);
    
    res.status(201).json({ 
      message: "Marks added successfully", 
      cgpa: savedStudent.cgpa,
      semesterMarks: savedStudent.semesterMarks,
      student: {
        studentId: savedStudent.studentId,
        name: savedStudent.name,
        cgpa: savedStudent.cgpa,
        semesterMarksCount: savedStudent.semesterMarks.length
      }
    });
  } catch (error) {
    console.error('=== MARKS ENTRY ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
