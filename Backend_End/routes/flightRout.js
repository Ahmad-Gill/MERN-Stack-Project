const express = require('express');
const router = express.Router();
const { createFlight } = require('../controllers/flightController');

router.post('/', createFlight); // POST /flights/add

module.exports = router;
