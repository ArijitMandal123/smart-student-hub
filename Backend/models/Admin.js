const mongoose = require('mongoose');

const generateAdminId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'ADM' + randomStr;
};

const adminSchema = new mongoose.Schema({
  adminId: {
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
  role: {
    type: String,
    default: 'Super Admin'
  },
  institution: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

adminSchema.pre('save', function(next) {
  if (!this.adminId) {
    this.adminId = generateAdminId();
  }
  next();
});

module.exports = mongoose.model('Admin', adminSchema);