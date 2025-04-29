const express = require('express');
const router = express.Router();
const { createFlight, sendEmail,getSpecificFlight } = require('../controllers/flightController');

// Ensure both routes are correct
router.post('/', createFlight); 
router.post('/email', sendEmail);
router.get('/getAddedFlights', getSpecificFlight);

module.exports = router;
