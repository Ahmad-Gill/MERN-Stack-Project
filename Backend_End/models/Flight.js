const mongoose = require('mongoose');

// Reusable schema for seat structure
const seatTypeSchema = new mongoose.Schema({
  total: { type: Number, default: 0 },
  booked: { type: Number, default: 0 }
}, { _id: false });

// Reusable schema for seat pricing
const seatPriceSchema = new mongoose.Schema({
  window: { type: Number, default: 0 },
  middle: { type: Number, default: 0 },
  aisle: { type: Number, default: 0 }
}, { _id: false });

// Main Flight schema
const flightSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  flightName: { type: String, required: true, trim: true },
  airlineCode: { type: String, trim: true },
  origin: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  totalEarnings: { type: Number, default: 0 },

  seats: {
    business: {
      window: seatTypeSchema,
      middle: seatTypeSchema,
      aisle: seatTypeSchema
    },
    economy: {
      window: seatTypeSchema,
      middle: seatTypeSchema,
      aisle: seatTypeSchema
    },
    firstClass: {
      window: seatTypeSchema,
      middle: seatTypeSchema,
      aisle: seatTypeSchema
    },
    premium: {
      window: seatTypeSchema,
      middle: seatTypeSchema,
      aisle: seatTypeSchema
    }
  },

  pricing: {
    business: seatPriceSchema,
    economy: seatPriceSchema,
    firstClass: seatPriceSchema,
    premium: seatPriceSchema
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
  },
  
});

// Create and export the model
const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
