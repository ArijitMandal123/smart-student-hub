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
  personalCertificates: [personalCertificateSchema]
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