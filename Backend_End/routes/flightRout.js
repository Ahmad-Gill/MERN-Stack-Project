const express = require('express');
const router = express.Router();
const { sendFlightTicketDetail,createFlight, sendEmail,getSpecificFlight,deleteFlight,getAllFlights ,getBookingsByEmail,saveBooking,getAllBookings,updatepayment} = require('../controllers/flightController');

// Ensure both routes are correct
router.post('/', createFlight); 
router.post('/email', sendEmail);
router.get('/getAddedFlights', getSpecificFlight);
router.get('/geetAll', getAllFlights);
router.delete('/delete/:flightId', deleteFlight);
router.get("/bookings/:email", getBookingsByEmail);
router.post("/bookings", saveBooking);
router.get("/getAllbookings", getAllBookings);
router.get("/u", updatepayment);
router.post('/email-ticket', sendFlightTicketDetail);



module.exports = router;
