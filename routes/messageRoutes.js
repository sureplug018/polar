const express = require('express');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

const router = express.Router();

router
  .route('/create-message')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    messageController.createMessage,
  );

router
  .route('/delete-message/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    messageController.deleteMessage,
  );

router
  .route('/edit-message/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    messageController.editMessage,
  );

module.exports = router;
