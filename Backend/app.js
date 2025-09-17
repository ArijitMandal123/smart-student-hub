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
const Message = require("./models/Message");
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

app.put("/api/groups/:groupId", async (req, res) => {
  try {
    const { name, teacher, students } = req.body;
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { name, teacher, students },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json({ message: "Group updated successfully", group });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Academic Certificates endpoints (separate from personal certificates)
app.post("/api/academic-certificates", upload.single("image"), async (req, res) => {
  try {
    console.log('Academic certificate request received:', req.body);
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    
    const certificateData = {
      domain: req.body.domain,
      certificateName: req.body.certificateName,
      image: req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        : req.body.image,
      certificateUrl: req.body.certificateUrl,
      date: req.body.date,
      issuedBy: req.body.issuedBy,
      description: req.body.description,
      skills: skills,
      duration: req.body.duration,
      location: req.body.location,
      organizationType: req.body.organizationType,
      status: req.body.status || 'pending',
      submittedAt: new Date()
    };

    const student = await Student.findOne({ studentId: req.body.studentId });
    if (!student) {
      console.log('Student not found:', req.body.studentId);
      return res.status(404).json({ error: "Student not found" });
    }

    // Initialize academicCertificates if it doesn't exist
    if (!student.academicCertificates) {
      student.academicCertificates = [];
      student.markModified('academicCertificates');
    }
    
    student.academicCertificates.push(certificateData);
    student.markModified('academicCertificates');
    

    
    await student.save();
    console.log('Academic certificate saved successfully');

    res.status(201).json({
      message: "Certificate submitted for review",
      certificate: certificateData,
    });
  } catch (error) {
    console.error('Academic certificate error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/academic-certificates/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Initialize academicCertificates if it doesn't exist
    if (!student.academicCertificates) {
      student.academicCertificates = [];
      student.markModified('academicCertificates');
      await student.save();
    }
    
    res.json(student.academicCertificates || []);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Personal Certificates endpoints (keeping existing functionality)
app.post("/api/certificates", upload.single("image"), async (req, res) => {
  try {
    console.log('Personal certificate request received:', req.body);
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
    console.log('Personal certificate saved successfully');

    res
      .status(201)
      .json({
        message: "Certificate added successfully",
        certificate: certificateData,
      });
  } catch (error) {
    console.error('Personal certificate error:', error);
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

// Faculty review endpoints for academic certificates
app.get("/api/teacher/academic-certificates/pending", async (req, res) => {
  try {
    const students = await Student.find(
      { "academicCertificates.status": "pending" },
      'studentId name academicCertificates'
    );
    
    const pendingCertificates = [];
    students.forEach(student => {
      student.academicCertificates.forEach(cert => {
        if (cert.status === 'pending') {
          pendingCertificates.push({
            ...cert.toObject(),
            studentId: student.studentId,
            studentName: student.name,
            _id: cert._id
          });
        }
      });
    });
    
    res.json(pendingCertificates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/teacher/academic-certificates/:studentId/:certificateId/review", async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
    }
    
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    const certificate = student.academicCertificates.id(req.params.certificateId);
    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    
    certificate.status = status;
    certificate.feedback = feedback;
    certificate.reviewedAt = new Date();
    
    // Update skills when certificate is approved
    if (status === 'approved' && certificate.skills && certificate.skills.length > 0) {
      if (!student.skills) {
        student.skills = {};
      }
      
      certificate.skills.forEach(skill => {
        student.skills[skill] = (student.skills[skill] || 0) + 1;
      });
      
      student.markModified('skills');
    }
    
    await student.save();
    
    res.json({ message: `Certificate ${status} successfully` });
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

app.delete("/api/academic-certificates/:studentId/:certificateId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    student.academicCertificates.pull({ _id: req.params.certificateId });
    await student.save();
    
    res.json({ message: "Academic certificate deleted successfully" });
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

// Teacher endpoints for marks management
app.post("/api/teacher/marks/:studentId", async (req, res) => {
  try {
    const { semester, year, sgpa } = req.body;
    
    if (!semester || !year || !sgpa) {
      return res.status(400).json({ error: "Semester, year, and SGPA are required" });
    }
    
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
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
      subjects: []
    };
    
    if (!student.semesterMarks) {
      student.semesterMarks = [];
    }
    
    student.semesterMarks.push(marksRecord);
    
    const totalSGPA = student.semesterMarks.reduce((sum, record) => sum + record.sgpa, 0);
    student.cgpa = parseFloat((totalSGPA / student.semesterMarks.length).toFixed(2));
    
    await student.save();
    
    res.status(201).json({ 
      message: "Marks added successfully", 
      cgpa: student.cgpa
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Teacher dashboard endpoints
app.get("/api/teacher/students", async (req, res) => {
  try {
    const students = await Student.find({}, 'studentId name email college department year semester cgpa');
    res.json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/teacher/student/:studentId/marks", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId }, 'studentId name semesterMarks cgpa');
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/teacher/marks/:studentId", async (req, res) => {
  try {
    const { semester, year, sgpa } = req.body;
    
    if (!semester || !year || !sgpa) {
      return res.status(400).json({ error: "Semester, year, and SGPA are required" });
    }
    
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    const markIndex = student.semesterMarks.findIndex(mark => 
      mark.semester === parseInt(semester) && mark.year === parseInt(year)
    );
    
    if (markIndex === -1) {
      return res.status(404).json({ error: "Semester record not found" });
    }
    
    student.semesterMarks[markIndex].sgpa = parseFloat(sgpa);
    
    const totalSGPA = student.semesterMarks.reduce((sum, record) => sum + record.sgpa, 0);
    student.cgpa = parseFloat((totalSGPA / student.semesterMarks.length).toFixed(2));
    
    await student.save();
    
    res.json({ 
      message: "SGPA updated successfully", 
      cgpa: student.cgpa
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student search endpoint
app.get("/api/search/students", async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Search query received:', query);
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters" });
    }
    
    const searchRegex = new RegExp(query.trim(), 'i');
    console.log('Search regex:', searchRegex);
    
    const students = await Student.find({
      $or: [
        { name: searchRegex },
        { studentId: searchRegex },
        { rollNumber: searchRegex },
        { email: searchRegex },
        { college: searchRegex },
        { department: searchRegex }
      ]
    }, '-password').limit(10);
    
    console.log('Students found:', students.length);
    res.json(students);
  } catch (error) {
    console.error('Search error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Test endpoint to check specific student ID
app.get("/api/test-student/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId }, '-password');
    if (!student) {
      return res.status(404).json({ error: "Student not found", searchedId: req.params.studentId });
    }
    res.json({ message: "Student found", student });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test endpoint to list all students
app.get("/api/test-all-students", async (req, res) => {
  try {
    const students = await Student.find({}, 'studentId name email college department');
    res.json({ count: students.length, students });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create test student with specific ID
app.post("/api/create-test-student", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testStudent = new Student({
      name: 'Test Student',
      email: 'test.student@example.com',
      password: hashedPassword,
      college: 'Test College',
      department: 'Computer Science',
      year: 2,
      semester: 4,
      rollNumber: 'TEST2023001',
      studentId: 'RIOITIxV20p', // Set the specific ID you're looking for
      profile: {
        profileImage: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=TS',
        mobileNumber: '9876543210',
        currentSGPA: 8.5,
        overallCGPA: 8.2
      },
      cgpa: 8.2
    });
    
    await testStudent.save();
    res.json({ message: 'Test student created', studentId: testStudent.studentId, name: testStudent.name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test endpoint to add skills (for testing purposes)
app.post("/api/test-skills/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    if (!student.skills) {
      student.skills = {};
    }
    
    // Add test skills
    student.skills['Java'] = 2;
    student.skills['Python'] = 1;
    student.skills['React'] = 1;
    
    student.markModified('skills');
    await student.save();
    
    res.json({ message: "Test skills added", skills: student.skills });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Messaging endpoints
app.post("/api/messages/send", async (req, res) => {
  try {
    const { senderId, senderName, senderType, groupId, subject, message } = req.body;
    
    if (!senderId || !senderName || !senderType || !groupId || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Get group details and students
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    
    // Get student details for recipients
    const students = await Student.find({ studentId: { $in: group.students } }, 'studentId name');
    
    const recipients = students.map(student => ({
      studentId: student.studentId,
      studentName: student.name,
      isRead: false
    }));
    
    const newMessage = new Message({
      senderId,
      senderName,
      senderType,
      recipients,
      subject,
      message,
      groupId,
      groupName: group.name
    });
    
    await newMessage.save();
    
    res.status(201).json({ 
      message: "Message sent successfully", 
      messageId: newMessage._id,
      recipientCount: recipients.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/messages/student/:studentId", async (req, res) => {
  try {
    const messages = await Message.find(
      { "recipients.studentId": req.params.studentId },
      'senderId senderName senderType subject message groupName createdAt recipients.$'
    ).sort({ createdAt: -1 });
    
    // Format messages for student view
    const formattedMessages = messages.map(msg => {
      const recipient = msg.recipients.find(r => r.studentId === req.params.studentId);
      return {
        _id: msg._id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderType: msg.senderType,
        subject: msg.subject,
        message: msg.message,
        groupName: msg.groupName,
        createdAt: msg.createdAt,
        isRead: recipient?.isRead || false,
        readAt: recipient?.readAt
      };
    });
    
    res.json(formattedMessages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/messages/:messageId/read/:studentId", async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    const recipient = message.recipients.find(r => r.studentId === req.params.studentId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }
    
    recipient.isRead = true;
    recipient.readAt = new Date();
    
    await message.save();
    
    res.json({ message: "Message marked as read" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/messages/unread-count/:studentId", async (req, res) => {
  try {
    const count = await Message.countDocuments({
      "recipients": {
        $elemMatch: {
          studentId: req.params.studentId,
          isRead: false
        }
      }
    });
    
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
