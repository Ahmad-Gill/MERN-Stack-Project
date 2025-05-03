const express = require('express');
const router = express.Router();
const { getUpcomingEventsByEmail,getUsers, signupUser,loginUser,createOrUpdateUser,getUserInformation } = require('../controllers/userController');

// router.get('/', getUsers);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/updateUser', createOrUpdateUser);
router.get('/', getUserInformation);
router.get('/users', getUsers);
router.get('/upcoming-events', getUpcomingEventsByEmail);

module.exports = router;
