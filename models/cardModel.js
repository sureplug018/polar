const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'blocked'],
      default: 'pending',
    },
    billingAddress: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      enum: ['Master card', 'Visa card'],
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    wallet: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

cardSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email',
  });
  next();
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
