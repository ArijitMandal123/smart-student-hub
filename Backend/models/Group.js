const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
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
  teacher: {
    type: String,
    required: true
  },
  students: [{
    type: String,
    required: true
  }],
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);