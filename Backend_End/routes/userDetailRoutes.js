const { Router } = require('express');
const router = Router();
const user_details = require('../controllers/UserDetailsController');

router.get('/user_details', user_details.getUserDetails);
router.post('/user_details/:email', user_details.createUserDetails);
router.put('/user_details/:email', user_details.updateUserDetails);

module.exports = router;
