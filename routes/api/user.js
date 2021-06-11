/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const UserController = require('../../controller/UserController');
const {parser} = require('../../middlewares/cloudinary');
const authGuard = require('../../middlewares/authguard');


// Get user profile
router.get('/user/profile', authGuard, UserController.getUserProfile);

// user updates profile
router.put('/user/update/profile', authGuard, UserController.updateBasicProfile);

// user change password
router.put('/user/change/password', authGuard, UserController.changePassword);

// upload profile picture
router.put("/user/profile/picture/update",  authGuard, parser.single('file'), UserController.updateProfileImage);

// user schedule counselling
router.post('/user/counselling/request', authGuard, UserController.scheduleCounselling);

// user view counselling requests
router.get('/user/view/counselling', authGuard, UserController.fetchCounsellingRequests);

// user view events
router.get('/user/view/events', authGuard, UserController.fetchEvents);

// user view Ministers
router.get('/user/view/ministers', authGuard, UserController.fetchAllMinisters);

// user view monthly vips
router.get('/user/view/vips', authGuard, UserController.fetchAllVIPDates);

module.exports = router;