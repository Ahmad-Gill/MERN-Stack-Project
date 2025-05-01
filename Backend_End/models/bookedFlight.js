const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true 
  },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  flightNo: String,
  airline: String,
  departure: String,
  departure_time: String,
  departure_date: String,
  destination: String,
  arrival_date: String,
  boarding_time: String,
  selectedClass: String,
  seatPreference: String,
  seatCount: Number,
  mealPreference: String,
  totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
