const Flight = require('../models/Flight');
const nodemailer = require('nodemailer');
const emailjs = require('emailjs-com'); 



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
  sendEmail
};
