const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

router.use(authController.protect); // Protect all routes after this middleware

// Apply for a new card
router.post('/apply-for-card', cardController.applyForCard);

router.patch('/update-card-status/:id', cardController.updateCardStatus);

router.post(
  '/approve-card/:id',
  authController.restrictTo('admin'), // Only admin can approve cards
  cardController.approveCard,
);

router.post(
  '/decline-card/:id',
  authController.restrictTo('admin'), // Only admin can decline cards
  cardController.declineCard,
);

module.exports = router;
