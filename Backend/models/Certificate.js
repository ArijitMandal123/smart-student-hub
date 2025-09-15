const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: false
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

module.exports = mongoose.model('Certificate', certificateSchema);