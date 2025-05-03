const mongoose = require('mongoose');

const upcomingEventSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  testDate: {
    type: Date,
    required: true,
  },
  testTime: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Upcoming Event'
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('UpcomingEvent', upcomingEventSchema);
