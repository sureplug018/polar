const express = require('express');
const authController = require('../controllers/authController');
const transactionRouter = require('./../routes/transactionRoutes');
const investmentRouter = require('./../routes/investmentRoutes');
const transactionController = require('./../controllers/transactionController');

const router = express.Router();

router.use('/:userId/transactions', transactionRouter);
router.use('/:userId/investments', investmentRouter);

router.post('/signup', authController.signup);

router.post('/confirm-email/:token/', authController.confirmEmailBE);

router.post('/login', authController.login);

router.post('/login/admin', authController.loginAdmin);

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// Assuming '/update' is the route where user data can be updated
router.patch(
  '/update',
  authController.protect,
  // transactionController.uploadPaymentProof,
  authController.updateUserData
);

router.delete(
  '/deleteUser/:id',
  authController.protect,
  authController.restrictTo('admin'),
  authController.deleteUser
);

router.patch(
  '/admin-edit-user-data/:userId',
  authController.protect,
  authController.restrictTo('admin'),
  authController.adminEditUserData
);

module.exports = router;
