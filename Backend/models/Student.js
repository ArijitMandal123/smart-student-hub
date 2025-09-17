const mongoose = require('mongoose');

const generateStudentId = (college) => {
  const initials = college.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return initials + randomStr;
};

const personalCertificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const academicCertificateSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: ['internship', 'skill', 'event', 'workshop']
  },
  certificateName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  certificateUrl: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  issuedBy: {
    type: String,
    required: true
  },
  description: String,
  skills: [String],
  duration: String,
  location: String,
  organizationType: {
    type: String,
    enum: ['corporate', 'educational', 'government', 'ngo']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  feedback: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date
}, {
  timestamps: true
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  githubLink: {
    type: String,
    required: true
  },
  deployLink: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    profileImage: String,
    aadharNumber: String,
    mobileNumber: String,
    collegeEmail: String,
    class10Certificate: String,
    class12Certificate: String,
    diplomaCertificate: String,
    bachelorDegree: String,
    masterDegree: String,
    doctorDegree: String,
    linkedinProfile: String,
    githubProfile: String,
    currentSGPA: { type: Number, default: 0 },
    overallCGPA: { type: Number, default: 0 }
  },
  personalCertificates: { type: [personalCertificateSchema], default: [] },
  academicCertificates: { type: [academicCertificateSchema], default: [] },
  projects: { type: [projectSchema], default: [] },
  skills: {
    type: Object,
    default: {}
  },
  semesterMarks: {
    type: [{
      semester: { type: Number, required: true },
      year: { type: Number, required: true },
      sgpa: { type: Number, required: true },
      subjects: {
        type: [{
          name: { type: String, required: true },
          marks: { type: Number, required: true },
          grade: { type: String, required: true }
        }],
        default: []
      }
    }],
    default: []
  },
  cgpa: { type: Number, default: 0 }
}, {
  timestamps: true
});

studentSchema.pre('save', function(next) {
  if (!this.studentId) {
    this.studentId = generateStudentId(this.college);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);