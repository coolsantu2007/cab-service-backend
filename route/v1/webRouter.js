const adminUserController = require('../../controller/adminUserController');
const bookingController = require('../../controller/bookingController');
const express = require('express');
const middleware = require('../../middleware/userAuth');
var router = express.Router();
const Auth = middleware.verifyToken

router.post('/create-admin-user',adminUserController.createAdminUser);
router.post('/admin-login',adminUserController.adminLogin);
router.post('/booking-request',bookingController.generateBookingRequest);
router.post('/update-booking-status',bookingController.updateBookingStatus);
router.get('/get-booking-details',bookingController.getBookingDetails);

module.exports = router