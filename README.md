# Smart Student Hub 🎓

**Centralized Digital Platform for Comprehensive Student Activity Records in Higher Education Institutions**

*Smart India Hackathon 2025 - Problem Statement #25093*

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Smart Student Hub is a comprehensive digital platform designed to centralize and manage student activity records in Higher Education Institutions (HEIs). The platform provides a unified solution for tracking academic achievements, extracurricular activities, certifications, projects, and overall student progress.

### 🎯 Problem Statement
Higher Education Institutions need a centralized system to:
- Track comprehensive student activity records
- Manage academic and non-academic achievements
- Facilitate NAAC compliance and reporting
- Provide transparent progress monitoring
- Enable efficient data management across departments

### 🚀 Solution
A full-stack web application that provides:
- **Student Portal**: Personal dashboard, achievement tracking, portfolio management
- **Faculty Interface**: Approval workflows, student oversight, bulk operations
- **Admin Panel**: System analytics, user management, institutional reporting
- **Public Search**: Transparent student profile discovery

## ✨ Features

### 👨‍🎓 Student Features
- **Dynamic Dashboard**: Personalized overview of academic progress and achievements
- **Digital Portfolio**: Comprehensive profile with academic records, projects, and certifications
- **Achievement Tracker**: Personal and academic certificate management with approval workflows
- **Project Showcase**: GitHub integration and deployment links
- **Academic Records**: Semester-wise marks, SGPA/CGPA tracking
- **Skills Management**: Dynamic skill tracking based on approved certifications
- **Messaging System**: Receive announcements and communications from faculty

### 👨‍🏫 Faculty Features
- **Approval Dashboard**: Review and approve student-submitted certificates and achievements
- **Student Management**: Search, view, and manage student records
- **Marks Entry**: Add and update student academic records
- **Group Communication**: Send messages to student groups
- **Bulk Operations**: Efficient management of multiple student records
- **Progress Monitoring**: Track student performance and engagement

### 👨‍💼 Admin Features
- **System Analytics**: Comprehensive dashboard with institutional metrics
- **User Management**: Manage students, faculty, and admin accounts
- **College & Department Setup**: Institutional structure management
- **Group Management**: Create and manage student-faculty groups
- **NAAC Compliance**: Generate reports for accreditation requirements
- **Data Export**: Export student data for external reporting

### 🔍 Public Features
- **Student Search**: Public search functionality for student profiles
- **Profile Discovery**: View student achievements and portfolios
- **Institutional Transparency**: Public access to student accomplishments

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React +      │◄──►│   (Node.js +    │◄──►│   (MongoDB)     │
│   Vite)         │    │   Express)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture
- **React 19** with functional components and hooks
- **React Router** for client-side routing
- **Tailwind CSS** for responsive UI design
- **Axios** for API communication
- **Vite** for fast development and building

### Backend Architecture
- **Node.js** runtime environment
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication (planned)
- **Multer** for file uploads
- **bcrypt** for password hashing

## 🛠️ Technology Stack

### Frontend
- **React** 19.1.1 - UI library
- **React Router DOM** 7.9.1 - Client-side routing
- **Tailwind CSS** 4.1.13 - Utility-first CSS framework
- **Axios** 1.12.2 - HTTP client
- **jsPDF** 3.0.2 - PDF generation
- **Vite** 7.1.2 - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.18.1 - MongoDB ODM
- **bcrypt** 6.0.0 - Password hashing
- **Multer** 2.0.2 - File upload middleware
- **CORS** 2.8.5 - Cross-origin resource sharing
- **dotenv** 17.2.2 - Environment variables

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone <repository-url>
cd smart-student-hub
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Create .env file
echo "PORT=3000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/smart-student-hub" >> .env
echo "NODE_ENV=development" >> .env

# Start MongoDB service
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start backend server
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend/smart-student-hub
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3000" > .env

# Start frontend development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### 5. Seed Data (Optional)
```bash
cd Backend

# Create test admin
node seedNew.js

# Create test students
node seedStudents.js
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/register          # Student registration
POST /api/login             # Student login
POST /api/teacher/register  # Teacher registration
POST /api/teacher/login     # Teacher login
POST /api/admin/register    # Admin registration
POST /api/admin/login       # Admin login
```

### Student Endpoints
```
GET    /api/students/:studentId           # Get student details
PUT    /api/profile/:studentId            # Update student profile
GET    /api/profile/:studentId            # Get student profile
POST   /api/certificates                  # Add personal certificate
GET    /api/certificates/:studentId      # Get personal certificates
POST   /api/academic-certificates        # Submit academic certificate
GET    /api/academic-certificates/:studentId # Get academic certificates
POST   /api/projects                     # Add project
GET    /api/projects/:studentId          # Get student projects
POST   /api/students/:studentId/marks    # Add semester marks
GET    /api/students/:studentId/marks    # Get student marks
```

### Faculty Endpoints
```
GET    /api/teacher/students                    # Get all students
GET    /api/teacher/academic-certificates/pending # Get pending certificates
PUT    /api/teacher/academic-certificates/:studentId/:certificateId/review # Review certificate
POST   /api/teacher/marks/:studentId           # Add student marks
PUT    /api/teacher/marks/:studentId           # Update student marks
GET    /api/teacher/groups/:teacherId          # Get teacher groups
```

### Admin Endpoints
```
GET    /api/admin/students              # Get all students
GET    /api/admin/teachers              # Get all teachers
POST   /api/colleges                   # Create college
GET    /api/colleges                   # Get all colleges
POST   /api/groups                     # Create student group
GET    /api/groups/:adminId            # Get admin groups
```

### Search & Messaging
```
GET    /api/search/students            # Search students
POST   /api/messages/send              # Send message to group
GET    /api/messages/student/:studentId # Get student messages
PUT    /api/messages/:messageId/read/:studentId # Mark message as read
```

## 👥 User Roles & Permissions

### 🎓 Student Role
- ✅ View personal dashboard and profile
- ✅ Manage personal certificates and achievements
- ✅ Submit academic certificates for approval
- ✅ Add and showcase projects
- ✅ View academic records and CGPA
- ✅ Receive messages from faculty
- ❌ Cannot approve certificates
- ❌ Cannot access other students' private data

### 👨‍🏫 Faculty Role
- ✅ View and search all students
- ✅ Approve/reject academic certificates
- ✅ Add and update student marks
- ✅ Send messages to student groups
- ✅ View student progress and analytics
- ❌ Cannot access admin functions
- ❌ Cannot manage system users

### 👨‍💼 Admin Role
- ✅ Full system access and analytics
- ✅ Manage all users (students, faculty, admins)
- ✅ Create and manage colleges/departments
- ✅ Generate institutional reports
- ✅ System configuration and settings
- ✅ NAAC compliance reporting

### 🌐 Public Access
- ✅ Search student profiles
- ✅ View public student information
- ❌ Cannot access private/sensitive data
- ❌ Cannot modify any information

## 🗄️ Database Schema

### Student Model
```javascript
{
  studentId: String (auto-generated),
  name: String,
  email: String (unique),
  password: String (hashed),
  college: String,
  department: String,
  year: Number,
  semester: Number,
  rollNumber: String (unique),
  profile: {
    profileImage: String,
    aadharNumber: String,
    mobileNumber: String,
    // ... other profile fields
  },
  personalCertificates: [CertificateSchema],
  academicCertificates: [AcademicCertificateSchema],
  projects: [ProjectSchema],
  skills: Object, // Dynamic skill tracking
  semesterMarks: [MarksSchema],
  cgpa: Number
}
```

### Teacher Model
```javascript
{
  teacherId: String (auto-generated),
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  department: String,
  college: String,
  designation: String,
  experience: Number
}
```

### Admin Model
```javascript
{
  adminId: String (auto-generated),
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,
  institution: String,
  department: String
}
```

### Certificate Models
```javascript
// Personal Certificate
{
  name: String,
  image: String (base64),
  url: String,
  date: Date,
  category: String,
  issuer: String
}

// Academic Certificate
{
  domain: String (internship/skill/event/workshop),
  certificateName: String,
  image: String (base64),
  certificateUrl: String,
  date: Date,
  issuedBy: String,
  description: String,
  skills: [String],
  duration: String,
  location: String,
  organizationType: String,
  status: String (pending/approved/rejected),
  feedback: String,
  submittedAt: Date,
  reviewedAt: Date
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart-student-hub
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Database Configuration
- **Database Name**: smart-student-hub
- **Collections**: students, teachers, admins, colleges, groups, messages
- **Indexes**: Automatic indexing on unique fields (email, studentId, etc.)

## 🚀 Deployment

### Production Setup
1. **Backend Deployment**:
   - Use PM2 for process management
   - Configure MongoDB Atlas for cloud database
   - Set up environment variables
   - Enable HTTPS with SSL certificates

2. **Frontend Deployment**:
   - Build production bundle: `npm run build`
   - Deploy to CDN or static hosting
   - Configure environment variables

3. **Database**:
   - Use MongoDB Atlas for production
   - Set up proper indexes
   - Configure backup strategies

## 🧪 Testing

### Test Accounts
After running seed scripts:

**Admin Account**:
- Email: testadmin@example.com
- Password: password123

**Test Endpoints**:
- GET /api/test - Backend connectivity
- POST /api/test-admin - Create test admin
- POST /api/test-teacher - Create test teacher

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

### Development Guidelines
- Follow ESLint configuration
- Use meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting

## 📄 License

This project is developed for Smart India Hackathon 2025. All rights reserved.

## 🆘 Support

For support and queries:
- Create an issue in the repository
- Contact the development team
- Refer to API documentation

---

**Smart Student Hub** - Empowering Higher Education through Digital Innovation 🚀
