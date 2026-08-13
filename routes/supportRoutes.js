const express = require('express');
const authController = require('../controllers/authController');
const supportController = require('../controllers/supportController');

const router = express.Router();

router.use(authController.protect);

router.post('/send-support', supportController.createSupport);

router.post(
  '/reply-support/:supportId',
  authController.restrictTo('admin'),
  supportController.replySupport,
);

router.post(
  '/send-mail/:id',
  authController.restrictTo('admin'),
  supportController.sendMail,
);

router.delete(
  '/delete-support/:supportId',
  authController.restrictTo('admin'),
  supportController.deleteSupport,
);

module.exports = router;
