# Smart Student Hub - Backend API 🚀

**Node.js Express API Server for Smart Student Hub Platform**

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Environment Variables](#environment-variables)
- [Testing](#testing)

## 🎯 Overview

The backend API server provides RESTful endpoints for the Smart Student Hub platform, handling user authentication, data management, file uploads, and business logic for students, teachers, and administrators.

## 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **Express.js** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.18.1 - MongoDB ODM
- **bcrypt** 6.0.0 - Password hashing
- **Multer** 2.0.2 - File upload middleware
- **CORS** 2.8.5 - Cross-origin resource sharing
- **dotenv** 17.2.2 - Environment variables

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Student.js           # Student schema
│   ├── Teacher.js           # Teacher schema
│   ├── Admin.js             # Admin schema
│   ├── College.js           # College schema
│   ├── Group.js             # Group schema
│   └── Message.js           # Message schema
├── .env                     # Environment variables
├── app.js                   # Main application file
├── package.json             # Dependencies
├── seedNew.js               # Admin seed script
└── seedStudents.js          # Student seed script
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (v5+)
- npm or yarn

### Setup Steps

1. **Install Dependencies**
```bash
cd Backend
npm install
```

2. **Environment Configuration**
```bash
# Create .env file
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-student-hub
NODE_ENV=development
```

3. **Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

4. **Run Server**
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

5. **Seed Data (Optional)**
```bash
# Create test admin
node seedNew.js

# Create test students
node seedStudents.js
```

## 📚 API Endpoints

### Authentication Endpoints

#### Student Authentication
```http
POST /api/register
POST /api/login
```

#### Teacher Authentication
```http
POST /api/teacher/register
POST /api/teacher/login
```

#### Admin Authentication
```http
POST /api/admin/register
POST /api/admin/login
```

### Student Management

#### Profile Management
```http
GET    /api/students/:studentId        # Get student details
PUT    /api/profile/:studentId         # Update profile
GET    /api/profile/:studentId         # Get profile
```

#### Certificate Management
```http
POST   /api/certificates               # Add personal certificate
GET    /api/certificates/:studentId    # Get personal certificates
DELETE /api/certificates/:studentId/:certificateId

POST   /api/academic-certificates      # Submit academic certificate
GET    /api/academic-certificates/:studentId
DELETE /api/academic-certificates/:studentId/:certificateId
```

#### Project Management
```http
POST   /api/projects                   # Add project
GET    /api/projects/:studentId        # Get projects
DELETE /api/projects/:studentId/:projectId
```

#### Academic Records
```http
POST   /api/students/:studentId/marks  # Add semester marks
GET    /api/students/:studentId/marks  # Get marks
```

### Teacher Endpoints

#### Student Management
```http
GET    /api/teacher/students           # Get all students
GET    /api/teacher/student/:studentId/marks
```

#### Certificate Review
```http
GET    /api/teacher/academic-certificates/pending
PUT    /api/teacher/academic-certificates/:studentId/:certificateId/review
```

#### Marks Management
```http
POST   /api/teacher/marks/:studentId   # Add marks
PUT    /api/teacher/marks/:studentId   # Update marks
```

#### Group Management
```http
GET    /api/teacher/groups/:teacherId  # Get teacher groups
```

### Admin Endpoints

#### User Management
```http
GET    /api/admin/students             # Get all students
GET    /api/admin/teachers             # Get all teachers
```

#### Institution Management
```http
POST   /api/colleges                  # Create college
GET    /api/colleges                  # Get colleges
POST   /api/colleges/:collegeId/departments
```

#### Group Management
```http
POST   /api/groups                    # Create group
GET    /api/groups/:adminId           # Get admin groups
PUT    /api/groups/:groupId           # Update group
```

### Search & Messaging

#### Search
```http
GET    /api/search/students           # Search students
```

#### Messaging
```http
POST   /api/messages/send             # Send message
GET    /api/messages/student/:studentId
PUT    /api/messages/:messageId/read/:studentId
GET    /api/messages/unread-count/:studentId
```

### Test Endpoints
```http
GET    /api/test                      # Backend connectivity
POST   /api/test-admin                # Create test admin
POST   /api/test-teacher              # Create test teacher
```

## 🗄️ Database Models

### Student Model
```javascript
{
  studentId: String (auto-generated),
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  college: String (required),
  department: String (required),
  year: Number (required),
  semester: Number (required),
  rollNumber: String (unique, required),
  profile: {
    profileImage: String,
    aadharNumber: String,
    mobileNumber: String,
    // ... other fields
  },
  personalCertificates: [PersonalCertificateSchema],
  academicCertificates: [AcademicCertificateSchema],
  projects: [ProjectSchema],
  skills: Object,
  semesterMarks: [MarksSchema],
  cgpa: Number
}
```

### Teacher Model
```javascript
{
  teacherId: String (auto-generated),
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phoneNumber: String (required),
  department: String (required),
  college: String (required),
  designation: String,
  experience: Number
}
```

### Admin Model
```javascript
{
  adminId: String (auto-generated),
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String,
  institution: String (required),
  department: String (required)
}
```

### Certificate Schemas

#### Personal Certificate
```javascript
{
  name: String (required),
  image: String (base64, required),
  url: String,
  date: Date (required),
  category: String (required),
  issuer: String (required)
}
```

#### Academic Certificate
```javascript
{
  domain: String (enum: internship/skill/event/workshop),
  certificateName: String (required),
  image: String (base64, required),
  certificateUrl: String,
  date: Date (required),
  issuedBy: String (required),
  description: String,
  skills: [String],
  duration: String,
  location: String,
  organizationType: String (enum),
  status: String (enum: pending/approved/rejected),
  feedback: String,
  submittedAt: Date,
  reviewedAt: Date
}
```

## 🔐 Authentication

### Password Security
- Passwords hashed using bcrypt with salt rounds: 10
- No plain text password storage

### Session Management
- Currently using localStorage (client-side)
- JWT implementation planned for future releases

### User ID Generation
- **Students**: College initials + 6 random characters
- **Teachers**: 'T' + College initials + 6 random characters  
- **Admins**: 'ADM' + 8 random characters

## 📁 File Upload

### Configuration
- **Storage**: Memory storage (base64 encoding)
- **Middleware**: Multer
- **Supported Types**: Images (certificates, profiles)
- **Size Limit**: 50MB per request

### Upload Endpoints
```javascript
// Single file upload
upload.single('image')

// Multiple file upload
upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'class10Certificate', maxCount: 1 },
  // ... other certificate fields
])
```

## 🔧 Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smart-student-hub

# Future JWT Configuration (planned)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

## 🧪 Testing

### Test Accounts
After running seed scripts:

**Admin Account**:
- Email: testadmin@example.com
- Password: password123

### Test Endpoints
```bash
# Test backend connectivity
curl http://localhost:3000/api/test

# Create test admin
curl -X POST http://localhost:3000/api/test-admin

# Create test teacher
curl -X POST http://localhost:3000/api/test-teacher
```

### Manual Testing
```bash
# Get all students (for testing)
curl http://localhost:3000/api/test-all-students

# Search for specific student
curl "http://localhost:3000/api/search/students?query=test"
```

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for cloud database
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Use PM2 for process management
- [ ] Set up logging and monitoring

### PM2 Configuration
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start app.js --name "smart-student-hub-api"

# Monitor
pm2 monit
```

## 🐛 Error Handling

### Common Error Responses
```javascript
// Validation Error
{
  "error": "Validation failed: email is required"
}

// Authentication Error
{
  "error": "Invalid email or password"
}

// Not Found Error
{
  "error": "Student not found"
}

// Server Error
{
  "error": "Internal server error"
}
```

## 📝 Development Notes

### Code Structure
- All routes defined in `app.js`
- Models in separate files under `models/`
- Database connection in `config/database.js`
- Extensive logging for debugging

### Future Enhancements
- JWT authentication implementation
- Rate limiting
- API documentation with Swagger
- Unit and integration tests
- Caching with Redis
- File storage with AWS S3

---

**Backend API Server** - Powering Smart Student Hub Platform 🚀