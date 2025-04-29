const Flight = require('../models/Flight');
const nodemailer = require('nodemailer');
const emailjs = require('emailjs-com'); 

const getSpecificFlight = async (req, res) => {
  try {
    const { email } = req.query; // ✅ FIXED: use query for GET

    const flights = await Flight.find({ email });

    if (!flights || flights.length === 0) {
      return res.status(404).json({ message: 'No flights found for this email' });
    }

    const flightsWithStats = flights.map(flight => {
      const computeStats = (seatObj = {}) => {
        const total = (seatObj.window?.total || 0) + (seatObj.middle?.total || 0) + (seatObj.aisle?.total || 0);
        const booked = (seatObj.window?.booked || 0) + (seatObj.middle?.booked || 0) + (seatObj.aisle?.booked || 0);
        return { totalSeats: total, bookedSeats: booked };
      };

      const computeProfit = (seatObj = {}, pricing = {}) => {
        return (
          (seatObj.window?.booked || 0) * (pricing.window || 0) +
          (seatObj.middle?.booked || 0) * (pricing.middle || 0) +
          (seatObj.aisle?.booked || 0) * (pricing.aisle || 0)
        );
      };

      const classes = ['business', 'economy', 'firstClass', 'premium'];
      const seatStats = {};
      const earnings = {};
      let totalEarnings = 0;

      for (const seatClass of classes) {
        seatStats[seatClass] = computeStats(flight.seats[seatClass]);
        earnings[seatClass] = computeProfit(flight.seats[seatClass], flight.pricing[seatClass]);
        totalEarnings += earnings[seatClass];
      }

      return {
        ...flight._doc,
        seatStats,
        earnings,
        totalEarnings
      };
    });

    return res.status(200).json({
      message: 'Flights fetched successfully',
      flights: flightsWithStats
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




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
      status,
      email
    } = req.body;

    // Validate required fields
    const missingFields = [
      'flightName', 'origin', 'destination',
      'departureDate', 'arrivalDate',
      'departureTime', 'arrivalTime'
    ].filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Ensure arrival date is not before departure date
    if (new Date(arrivalDate) < new Date(departureDate)) {
      return res.status(400).json({
        message: "Arrival date cannot be before departure date."
      });
    }

    // Normalize seats structure: { total, booked: 0 }
    const seatClasses = ['business', 'economy', 'firstClass', 'premium'];
    const seatTypes = ['window', 'middle', 'aisle'];

    const formattedSeats = seatClasses.reduce((acc, cls) => {
      acc[cls] = seatTypes.reduce((typeAcc, type) => {
        const total = seats?.[cls]?.[type] || 0;
        typeAcc[type] = { total, booked: 0 };
        return typeAcc;
      }, {});
      return acc;
    }, {});

    // Default food options if not provided
    const defaultFoodOptions = {
      veg: true,
      nonVeg: false,
      mutton: false,
      beef: false
    };

    const newFlight = new Flight({
      email,
      flightName,
      airlineCode,
      origin,
      destination,
      departureDate,
      arrivalDate,
      departureTime,
      arrivalTime,
      seats: formattedSeats,
      pricing,
      foodOptions: foodOptions || defaultFoodOptions,
      status
    });

    const savedFlight = await newFlight.save();
    res.status(201).json({
      message: "Flight created successfully",
      flight: savedFlight
    });
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ message: "Server error while creating flight" });
  }
};



// Send email
const sendEmail = async (req, res) => {
  const { to, flight, date, seat, bank_name, acc_number, acc_name, price } = req.body;

  if (!to || !flight || !date || !seat || !bank_name || !acc_number || !acc_name || !price) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Predefined email text with dynamic values
  const emailText = `
Thank You for Your Order!

Thank you for confirming your flight seat reservations. We're excited to assist you with your upcoming trip!

Booking Details:

Flight: ${flight}
Date: ${date}
Seat: ${seat}

To proceed with your booking, please make the payment of $${price} to the following account details:

Payment Details:

Bank Name: ${bank_name}
Account Number: ${acc_number}
Account Name: ${acc_name}

Total Amount: $${price}
`;

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aipicmailmanagement@gmail.com',
        pass: 'ypzj kskr icvl joqy'
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: 'aipicmailmanagement@gmail.com',
      to: to,
      subject: 'Thank You for Your Flight Reservation!',
      text: emailText
    });

    res.json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

// Export both functions
module.exports = {
  createFlight,
  sendEmail,
  getSpecificFlight,
};
