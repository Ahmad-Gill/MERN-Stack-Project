const express = require('express');
const router = express.Router();
const { getUsers, signupUser,loginUser,createOrUpdateUser,getUserInformation } = require('../controllers/userController');

// router.get('/', getUsers);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/updateUser', createOrUpdateUser);
router.get('/', getUserInformation);

module.exports = router;
