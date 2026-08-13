const mongoose = require('mongoose');
const validator = require('validator');

const supportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A support mail must have a user'],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: 'Invalid email address',
      },
    },
    subject: {
      type: String,
      required: [true, 'A support mail must have a subject'],
    },
    message: {
      type: String,
      required: [true, 'A support mail must have a message'],
    },
    status: {
      type: String,
      required: [true, 'A support mail must have a status'],
      enum: ['pending', 'replied'],
      default: 'pending',
    },
    category: String,
  },
  {
    timestamps: true,
  },
);

supportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'firstName email',
  });
  next();
});

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
