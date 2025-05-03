const express = require('express');
const Router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
Router.post('/signup', authController.signup);
Router.post('/signin', authController.signin);

module.exports = Router;


