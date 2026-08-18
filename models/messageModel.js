const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'warning', 'error'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
