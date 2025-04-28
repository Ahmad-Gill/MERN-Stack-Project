const express = require('express');
const router = express.Router();
const { createFlight, sendEmail } = require('../controllers/flightController');

// Ensure both routes are correct
router.post('/', createFlight); 
router.post('/email', sendEmail);

module.exports = router;
