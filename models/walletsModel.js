const mongoose = require('mongoose');

const walletsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A wallet must have a name'],
      // unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'A wallet must have an address'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

walletsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'email firstName lastName',
  });
  next();
});

const Wallet = mongoose.model('Wallet', walletsSchema);

module.exports = Wallet;
