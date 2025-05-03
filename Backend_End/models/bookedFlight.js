const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    ref: 'User' // Ensure 'User' model exists and email is the correct field for reference
  },
  flightId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Flight", 
    required: true 
  },
  flightNo: { 
    type: String, 
    required: true // Make this required if it's important
  },
  airline: { 
    type: String, 
    required: true // Same here, if this is always required
  },
  departure: { 
    type: String, 
    required: true
  },
  departure_time: { 
    type: String, 
    required: true
  },
  departure_date: { 
    type: Date, 
    required: true // Change this to Date type
  },
  destination: { 
    type: String, 
    required: true
  },
  arrival_date: { 
    type: Date, 
    required: true // Change this to Date type
  },
  boarding_time: { 
    type: String, 
    required: true
  },
  selectedClass: { 
    type: String, 
    required: true
  },
  seatPreference: { 
    type: String, 
    required: true
  },
  seatCount: { 
    type: Number, 
    required: true // If seatCount is essential
  },
  mealPreference: { 
    type: String, 
    required: true
  },
  totalAmount: { 
    type: Number, 
    required: true
  },
  paymentConfirmed: {
    type: Boolean,
    default: false
  }
  
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
