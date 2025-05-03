const Flight = require('../models/Flight');
const nodemailer = require('nodemailer');
const emailjs = require('emailjs-com'); 
const Booking = require("../models/bookedFlight");
const mongoose = require("mongoose");
const UpcomingEvent = require('../models/UpcomingEvent');


async function addUpcomingEvent(email, text) {
  const currentDateTime = new Date();
  console.log(email,text)
  
  const event = new UpcomingEvent({
    email: email,
    testDate: currentDateTime,  // Automatically set to the current date and time
    testTime: currentDateTime.toLocaleTimeString(),  // Automatically set to the current time
    title: text
  });

  try {
    const savedEvent = await event.save();
    console.log('Event added:', savedEvent);
  } catch (err) {
    console.error('Error adding event:', err);
  }
}





const sendFlightTicketDetail = async (req, res) => {
  const {
    email,
    flightNo,
    airline,
    departure,
    departure_time,
    departure_date,
    destination,
    arrival_date,
    boarding_time,
    selectedClass,
    seatPreference,
    seatCount,
    mealPreference,
    totalAmount,
    paymentConfirmed
  } = req.body;

  // Basic validation
  if (
    !email || !flightNo || !airline || !departure || !departure_time ||
    !departure_date || !destination || !arrival_date || !boarding_time ||
    !selectedClass || !seatPreference || !seatCount || !mealPreference ||
    !totalAmount || paymentConfirmed === undefined
  ) {
    return res.status(400).json({ message: 'All flight details are required.' });
  }

  console.log("Sending flight ticket email to:", email);

  const emailText = `
🎫 Flight Ticket Details

Thank you for booking with us! Here are your flight details:

✈️ Flight Number: ${flightNo}
🛫 Airline: ${airline}
📍 Departure: ${departure}
🕒 Departure Time: ${departure_time}
📅 Departure Date: ${new Date(departure_date).toLocaleDateString()}

📌 Destination: ${destination}
📅 Arrival Date: ${new Date(arrival_date).toLocaleDateString()}
🕑 Arival Time: ${boarding_time}

💺 Class: ${selectedClass}
🪟 Seat Preference: ${seatPreference}
👥 Number Seat: ${seatCount}
🍽️ Meal Preference: ${mealPreference}

💵 Total Amount: $${totalAmount}
✅ Payment Confirmed: ${paymentConfirmed ? 'Yes' : 'No'}


Thank you,
Flight Booking Team
`;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aipicmailmanagement@gmail.com',
        pass: 'ypzj kskr icvl joqy' // Consider using environment variables!
      }
    });

    const info = await transporter.sendMail({
      from: 'aipicmailmanagement@gmail.com',
      to: email,
      subject: 'Your Flight Ticket Confirmation',
      text: emailText
    });

    res.json({ message: 'Email sent successfully', info });
    addUpcomingEvent(email, 'Sent Flight ticket');
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};





const updatepayment = async (req, res) => {
  const { _id } = req.query; // 👈 Use `req.query` for GET request
  console.log("Received ID:", _id);

  if (!_id) {
    return res.status(400).json({ success: false, message: "Flight ID is required" });
  }

  try {
    const updatedFlight = await Booking.findByIdAndUpdate(
      _id,
      { paymentConfirmed: true },
      { new: true }
    );

    if (!updatedFlight) {
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    res.status(200).json({ success: true, message: "Payment confirmed" });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const sendEmail = async (req, res) => {
 

  const { to, flight, date, seat, bank_name, acc_number, acc_name, price } = req.body;

  if (!to || !flight || !date || !seat || !bank_name || !acc_number || !acc_name || !price) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  console.log("Attempting to send email to:", to);

  // Predefined email text with dynamic values
  const emailText = `
Thank You for Your Order!

Thank you for confirming your flight seat reservations. We're excited to assist you with your upcoming trip!

Booking Details:

Flight: ${flight}
Date: ${date}
Number of Seats: ${seat}

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


const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ email });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this email." });
    }

    res.status(200).json({ message: "Bookings fetched successfully", bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch all bookings

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found." });
    }

    res.status(200).json({ message: "All bookings fetched successfully", bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveBooking = async (req, res) => {
  try {
    const {
      email,
      flightId,
      flightNo,
      airline,
      departure,
      departure_time,
      departure_date,
      destination,
      arrival_date,
      boarding_time,
      selectedClass,
      seatPreference,
      seatCount,
      mealPreference,
      totalAmount,
    } = req.body;

    // Convert seatCount to number
    const seatCountNumber = Number(seatCount);

    // Basic validation
    if (
      !email ||
      !flightId ||
      !selectedClass ||
      !seatPreference ||
      !seatCountNumber ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "Required booking details missing." });
    }

    // Save booking
    const newBooking = new Booking({
      email,
      flightId,
      flightNo,
      airline,
      departure,
      departure_time,
      departure_date,
      destination,
      arrival_date,
      boarding_time,
      selectedClass,
      seatPreference,
      seatCount: seatCountNumber,
      mealPreference,
      totalAmount,
    });

    await newBooking.save();
    await addUpcomingEvent(email, `Booking Saved for flight  ${flightNo} -> ${airline}`);

    // Update Flight document
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found." });
    }

    // Check seat availability before booking
    const seatCategory = flight.seats[selectedClass][seatPreference];

    // Update booked seats count in the relevant seat category
    seatCategory.booked += seatCountNumber;

    // Update pricing and earnings
    const seatPrice = flight.pricing[selectedClass][seatPreference];
    const earnings = seatPrice * seatCountNumber;

    // Update total earnings for the selected class
    flight.totalEarnings += earnings;

    // Save the updated flight document
    await flight.save();

    // Call sendEmail using mock req/res
    const emailReq = {
      body: {
        to: email,
        flight: flightNo,
        date: departure_date,
        seat: `${seatCountNumber} (${selectedClass}, ${seatPreference})`,
        bank_name: "Bank of Flights",
        acc_number: "1234567890",
        acc_name: "Air Booking Services",
        price: totalAmount,
      },
    };

    const emailRes = {
      status: (code) => ({
        json: (data) => console.log(`[Email Response ${code}]`, data),
      }),
      json: (data) => console.log("[Email Response]", data),
    };

    await sendEmail(emailReq, emailRes);

    // Send final response after saving the booking and sending email
    
    return res.status(201).json({
      message: "Booking saved, flight updated, and confirmation email sent.",
      booking: newBooking,
    });

  } catch (error) {
    console.error("Error saving booking or updating flight:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate booking detected for this email." });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};




const deleteFlight = async (req, res) => {
  try {
    const { flightId } = req.params; // Get flight ID from the URL params

    // Find the flight by ID and delete it
    const deletedFlight = await Flight.findByIdAndDelete(flightId);

    if (!deletedFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Return a success response
    return res.status(200).json({ message: 'Flight deleted successfully', deletedFlight });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return res.status(500).json({ message: 'Server error while deleting flight', error });
  }
};
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
    const newPrice = {};
    ['business', 'economy', 'firstClass', 'premium'].forEach(classType => {
      newPrice[classType] = {};
      ['window', 'middle', 'aisle'].forEach(seatType => {
        const originalPrice = pricing?.[classType]?.[seatType] || 0;
        newPrice[classType][seatType] = Math.round(originalPrice * 1.1); // Integer + 10%
      });
    });
    console.log("Final pricing data:", newPrice);
    

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
      totalEarnings:0,
      seats: formattedSeats,
      pricing : newPrice,
      foodOptions: foodOptions || defaultFoodOptions,
      status,
      
    });

    const savedFlight = await newFlight.save();
    await addUpcomingEvent(email, `Flight Listing Aded successfully  ${origin} -> ${destination}`);
    console.log(newFlight)
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

const getAllFlights = async (req, res) => {
  try {
    // Fetch all flights from the Flight model
    const flights = await Flight.find();

    if (!flights || flights.length === 0) {
      return res.status(404).json({ message: 'No flights found' });
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
      message: 'All flights fetched successfully',
      flights: flightsWithStats
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export both functions
module.exports = {
  createFlight,
  sendEmail,
  getSpecificFlight,
  deleteFlight,
  getAllFlights,
  getBookingsByEmail,
  saveBooking,
  getAllBookings,
  updatepayment,
  sendFlightTicketDetail,
};
