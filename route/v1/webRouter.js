const adminUserController = require('../../controller/adminUserController');
const bookingController = require('../../controller/bookingController');
const express = require('express');
const middleware = require('../../middleware/userAuth');
var router = express.Router();
const Auth = middleware.verifyAdminToken

router.post('/create-admin-user',adminUserController.createAdminUser);
router.post('/admin-login',adminUserController.adminLogin);
router.post('/booking-request',bookingController.generateBookingRequest);
router.post('/update-booking-status',bookingController.updateBookingStatus);
router.get('/get-booking-details',bookingController.getBookingDetails);
router.get('/get-booking-details-by-id',bookingController.getBookingDetailsById);
router.get('/admin-logout',Auth, adminUserController.adminLogout);
router.post('/admin-reset-password',adminUserController.resetAdminPassword);

module.exports = router