const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');

// Define the GET route for /user
router.get('/', getUsers);  // This should work for the GET request to /user
router.post('/', createUser);  // This should work for the POST request to /user

module.exports = router;
