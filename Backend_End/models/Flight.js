const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightName: { type: String, required: true },
  airlineCode: { type: String, required: false },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },

  seats: {
    business: {
      window: { type: Number, default: 0 },
      middle: { type: Number, default: 0 },
      aisle: { type: Number, default: 0 }
    },
    economy: {
      window: { type: Number, default: 0 },
      middle: { type: Number, default: 0 },
      aisle: { type: Number, default: 0 }
    },
    firstClass: {
      window: { type: Number, default: 0 },
      middle: { type: Number, default: 0 },
      aisle: { type: Number, default: 0 }
    },
    premium: {
      window: { type: Number, default: 0 },
      middle: { type: Number, default: 0 },
      aisle: { type: Number, default: 0 }
    }
  },

  pricing: {
    business: {
      window: { type: Number },
      middle: { type: Number },
      aisle: { type: Number }
    },
    economy: {
      window: { type: Number },
      middle: { type: Number },
      aisle: { type: Number }
    },
    firstClass: {
      window: { type: Number },
      middle: { type: Number },
      aisle: { type: Number }
    },
    premium: {
      window: { type: Number },
      middle: { type: Number },
      aisle: { type: Number }
    }
  },

  foodOptions: {
    veg: { type: Boolean, default: true },
    nonVeg: { type: Boolean, default: false },
    mutton: { type: Boolean, default: false },
    beef: { type: Boolean, default: false }
  },

  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled'],
    default: 'On Time'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
