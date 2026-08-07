const express = require('express');
const authController = require('./../controllers/authController');
const transactionController = require('./../controllers/transactionController');

const router = express.Router({ mergeParams: true });

router
  .route('/deposit')
  .post(
    authController.protect,
    transactionController.uploadPaymentProof,
    transactionController.deposit
  );

router
  .route('/withdraw')
  .post(authController.protect, transactionController.withdraw);

router.post(
  '/transfer',
  authController.protect,
  authController.restrictTo('user'),
  transactionController.transfer
);

router
  .route('/confirm-transaction/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.confirmTransaction
  );

router
  .route('/decline-transaction/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.declineTransaction
  );

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.getAllTransactions
  );

router
  .route('/my-transactions')
  .get(
    authController.protect,
    transactionController.getTransactionsOfCurrentUser
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.getTransactionsOfAUser
  );

router.post(
  '/exchange',
  authController.protect,
  authController.restrictTo('user'),
  transactionController.exchange
);

router
  .route('/direct-deposit/:userId')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.directDeposit
  );
module.exports = router;
