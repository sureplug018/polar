const mongoose = require('mongoose');
const crypto = require('crypto');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A transaction must have a user'],
    },
    amount: {
      type: Number,
      required: [true, 'A transaction must have an amount'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'system', 'cashback', 'bonus'],
    },
    wallet: {
      type: String,
      required: true,
    },
    plan: {
      type: mongoose.Schema.ObjectId,
      ref: 'Plan',
    },
    address: String,
    paymentProof: String,
  },
  {
    timestamps: true,
  }
);

transactionSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = crypto.randomBytes(10).toString('hex');
  }
  next();
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
