const Flight = require('../models/Flight');

// Create a new flight
const createFlight = async (req, res) => {
  try {
    const {
      flightName,
      airlineCode,
      origin,
      destination,
      departureDate,
      arrivalDate,
      departureTime,
      arrivalTime,
      seats,
      pricing,
      foodOptions,
      status
    } = req.body;

    // Basic validation
    if (!flightName || !origin || !destination || !departureDate || !arrivalDate || !departureTime || !arrivalTime) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const newFlight = new Flight({
      flightName,
      airlineCode,
      origin,
      destination,
      departureDate,
      arrivalDate,
      departureTime,
      arrivalTime,
      seats,
      pricing,
      foodOptions,
      status
    });

    const savedFlight = await newFlight.save();
    res.status(201).json({ message: "Flight created successfully", flight: savedFlight });
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ message: "Server error while creating flight" });
  }
};

module.exports = {
  createFlight
};
