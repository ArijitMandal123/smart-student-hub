const mongoose = require('mongoose');

const generateTeacherId = (college) => {
  const initials = college.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'T' + initials + randomStr;
};

const teacherSchema = new mongoose.Schema({
  teacherId: {
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
  phoneNumber: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    default: 'Assistant Professor'
  },
  experience: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

teacherSchema.pre('save', function(next) {
  if (!this.teacherId) {
    this.teacherId = generateTeacherId(this.college);
  }
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);