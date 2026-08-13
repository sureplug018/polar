const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const mongoose = require('mongoose');
const Transaction = require('../models/transactionsModel');
const User = require('./../models/userModel');
const Kyc = require('../models/kycModel');
const Mail = require('../utilities/notificationEmail');
const Plan = require('../models/planModel');
const Investment = require('../models/investmentModel');
const crypto = require('crypto');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let transformation = [];
    let folder;
    let public_id;
    let allowed_formats;

    if (file.fieldname === 'paymentProof') {
      folder = 'covers';
      public_id = `cover-${Date.now()}`;
      allowed_formats = ['jpg', 'jpeg', 'png'];
      if (file.mimetype.startsWith('image')) {
        transformation = [{ width: 500, height: 500, crop: 'limit' }];
      }
    }

    return {
      folder,
      allowed_formats,
      transformation,
      public_id,
    };
  },
});

// Multer middleware to handle multiple fields
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB per file
}).fields([
  { name: 'paymentProof', maxCount: 1 }, // Single file for front
]);

// Middleware to handle the upload
// Middleware function to handle file uploads and errors
exports.uploadPaymentProof = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'fail',
          message: 'File size should not exceed 10MB',
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          status: 'fail',
          message: 'Limit expected',
        });
      }
      if (err.message === 'An unknown file format not allowed') {
        return res.status(400).json({
          status: 'fail',
          message: 'Unsupported  file  format',
        });
      }
    } else if (err) {
      // Handle general errors
      console.log(err);
      return res.status(500).json({
        status: 'fail',
        message: err.message,
      });
    }

    // Proceed if no errors
    next();
  });
};

exports.deposit = async (req, res) => {
  const { amount, wallet, address, plan, paymentMethod } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const planDetails = await Plan.findById(plan);
    if (!plan)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Choose an investment plan' });

    if (!amount)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Enter an amount' });

    if (!paymentMethod)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Select a payment method' });

    if (paymentMethod === 'wallet' && !wallet)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Select a wallet' });

    if (paymentMethod === 'balance') {
      if (user.balance < amount) {
        return res.status(400).json({
          status: 'fail',
          message: 'Insufficient balance',
        });
      }
    }
    if (amount < planDetails.min) {
      return res.status(400).json({
        status: 'fail',
        message: `Your capital is less than the minimum investment for ${planDetails.name} plan`,
      });
    }

    if (amount > planDetails.max) {
      return res.status(400).json({
        status: 'fail',
        message: `Your capital is greater than maximum investment for ${planDetails.name} plan`,
      });
    }

    // Handle optional payment proof
    // const paymentProof =
    //   req.files && req.files.paymentProof
    //     ? req.files.paymentProof[0].path
    //     : null; // Cloudinary URL or null

    if (user.depositStatus === false) {
      return res.status(400).json({
        status: 'fail',
        message:
          'This user can no longer perform this action! Contact support for more info',
      });
    }

    const transactionId = crypto.randomBytes(10).toString('hex');

    const type = 'deposit';

    if (paymentMethod === 'balance') {
      user.balance -= Number(amount);
      user.profit += Number(amount);
      await user.save();

      // create a new investment instantly if the user is depositing from balance
      await Investment.create({
        transactionId,
        user,
        plan: planDetails.id,
        amount: Number(amount),
        daysRemaining: planDetails.duration,
        status: 'active',
      });
    }

    const newTransaction = await Transaction.create({
      transactionId,
      user,
      amount,
      wallet: paymentMethod === 'balance' ? 'balance' : wallet,
      // paymentProof,
      type,
      status: paymentMethod === 'wallet' ? 'pending' : 'confirmed',
      address,
      plan: planDetails.id,
    });

    if (paymentMethod === 'wallet') {
      const subject = 'Your Transaction is Currently Pending';
      const currentUser = await User.findById(user);
      await new Mail(
        currentUser,
        subject,
        newTransaction,
      ).sendPendingTransaction();

      const admins = await User.find({ role: 'admin' });

      for (const admin of admins) {
        await new Mail(
          admin,
          'New deposit transaction',
          newTransaction,
        ).sendPendingTransaction();
      }
    }

    return res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const user = req.user;
    if (!req.body.user) req.body.user = req.user;

    if (user.kycStatus === true) {
      const kyc = await Kyc.findOne({ user: user.id });

      if (!kyc) {
        return res.status(400).json({
          status: 'fail',
          message: 'KYC information is missing',
        });
      }

      if (kyc.status !== 'Verified') {
        return res.status(400).json({
          status: 'fail',
          message: 'Access denied: KYC not verified',
        });
      }
    }

    const type = 'withdrawal';
    const { amount, wallet, address } = req.body;
    if (req.user.balance < amount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Insufficient balance',
      });
    }

    if (user.withdrawalStatus === false) {
      return res.status(400).json({
        status: 'fail',
        message:
          'This user can no longer perform this action! Contact support for more info',
      });
    }

    // subtract the money
    user.balance -= Number(amount);
    await user.save();
    const transactionId = crypto.randomBytes(10).toString('hex');
    const newTransaction = await Transaction.create({
      transactionId,
      user,
      amount,
      wallet,
      address,
      type,
    });

    const currentUser = await User.findById(user);

    const subject = 'Your Transaction is Currently Pending';

    await new Mail(
      currentUser,
      subject,
      newTransaction,
    ).sendPendingTransaction();

    const admins = await User.find({ role: 'admin' });

    for (const admin of admins) {
      await new Mail(
        admin,
        'New withdrawal transaction',
        newTransaction,
      ).sendPendingTransaction();
    }

    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { email, type, status } = req.query;

    const filter = {};

    // filter by transaction type
    if (type) {
      filter.type = type; // e.g. 'deposit', 'withdrawal'
    }

    if (status) {
      filter.status = status;
    }

    // filter by user email (assuming Transaction has user ref)
    if (email) {
      const matchedUsers = await User.find({
        email: { $regex: email, $options: 'i' },
      }).select('_id');

      filter.user = { $in: matchedUsers.map((u) => u._id) };
    }

    const transactions = await Transaction.find(filter)
      .populate('user') // optional if you need user data
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.confirmTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findById(transactionId);

    //find user that want to deposit by transaction id
    const user = await User.findById(transaction.user._id);

    if (transaction.type === 'deposit') {
      await User.findByIdAndUpdate(transaction.user._id, {
        $inc: { profit: Number(transaction.amount) },
      });

      if (transaction.wallet !== 'balance') {
        const planDetails = await Plan.findById(transaction.plan);

        // create new investment when the payment gateway is not from balance

        const transactionHash = crypto.randomBytes(10).toString('hex');

        // create a new investment instantly if the user is depositing from balance
        await Investment.create({
          transactionId: transactionHash,
          user,
          plan: planDetails.id,
          amount: Number(transaction.amount),
          daysRemaining: planDetails.duration,
          status: 'active',
        });
      }

      //check if the user was referred by another user
      if (user.referral) {
        const referral = await User.findOne({ myReferralCode: user.referral });

        const userDeposit = await Transaction.find({
          user: user._id,
          type: 'deposit',
          status: 'confirmed',
        });

        if (userDeposit.length === 0) {
          // Update the referral balance with the referral bonus amount
          await User.findByIdAndUpdate(referral.id, {
            $inc: { profit: Number(transaction.amount) * 0.1 },
          });

          await Transaction.create({
            type: 'system',
            user: referral._id,
            amount: Number(transaction.amount) * 0.1,
            status: 'confirmed',
            wallet: 'Bonus',
            address: 'System',
          });
        }
      }
    }

    transaction.status = 'confirmed';
    await transaction.save();

    // if (transaction.type === 'withdrawal') {
    //   await User.findByIdAndUpdate(transaction.user._id, {
    //     $inc: { balance: -transaction.amount },
    //   });
    // }

    const subject = 'Your Transaction Has Been Confirmed';

    await new Mail(user, subject, transaction).sendConfirmedTransaction();

    res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.declineTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findByIdAndUpdate(transactionId, {
      status: 'declined',
    });

    //find user that want to deposit by transaction id
    const user = await User.findById(transaction.user._id);

    const subject = 'Your Transaction Has Been Declined';

    if (transaction.type === 'withdrawal') {
      await User.findByIdAndUpdate(transaction.user._id, {
        $inc: { balance: Number(transaction.amount) },
      });
    }

    await new Mail(user, subject, transaction).sendConfirmedTransaction();

    res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTransactionsOfCurrentUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTransactionsOfAUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.id });

    res.status(200).json({
      status: 'success',
      result: transactions.length,
      data: {
        transactions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.directDeposit = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, type, wallet } = req.body;

    const amountValue = Number(amount);

    // Validate amount
    if (!amountValue || amountValue <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid amount',
      });
    }

    // Validate transaction type
    const validTypes = ['add', 'subtract', 'cashback'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid transaction type',
      });
    }

    // Validate wallet
    const validWallets = ['balance', 'profit'];

    if (type !== 'cashback' && (!wallet || !validWallets.includes(wallet))) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid wallet selected',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CASHBACK
    |--------------------------------------------------------------------------
    */
    if (type === 'cashback') {
      user.balance += amountValue;

      await user.save();

      const newCashback = await Transaction.create({
        amount: amountValue,
        user: user.id,
        type: 'cashback',
        wallet: 'balance',
        status: 'confirmed',
        address: null,
        paymentProof: null,
      });

      const subject = '🎉 You’ve received cashback';

      await new Mail(user, subject, newCashback).cashbackMail();

      return res.status(200).json({
        status: 'success',
        data: newCashback,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | BALANCE WALLET
    |--------------------------------------------------------------------------
    */
    if (wallet === 'balance') {
      if (type === 'subtract' && user.balance < amountValue) {
        return res.status(400).json({
          status: 'fail',
          message: 'Insufficient balance',
        });
      }

      user.balance =
        type === 'add'
          ? user.balance + amountValue
          : user.balance - amountValue;
    }

    /*
    |--------------------------------------------------------------------------
    | PROFIT WALLET
    |--------------------------------------------------------------------------
    */
    if (wallet === 'profit') {
      if (type === 'subtract' && user.profit < amountValue) {
        return res.status(400).json({
          status: 'fail',
          message: 'Insufficient profit balance',
        });
      }

      user.profit =
        type === 'add' ? user.profit + amountValue : user.profit - amountValue;
    }

    await user.save();

    /*
    |--------------------------------------------------------------------------
    | CREATE TRANSACTION
    |--------------------------------------------------------------------------
    */
    const newTransaction = await Transaction.create({
      user: user.id,
      type: 'system',
      operation: type,
      amount: amountValue,
      wallet,
      status: 'confirmed',
      address: null,
      paymentProof: null,
    });

    /*
    |--------------------------------------------------------------------------
    | EMAIL USER
    |--------------------------------------------------------------------------
    */
    const subject =
      type === 'add'
        ? 'Funds Added To Your Account'
        : 'Funds Deducted From Your Account';

    await new Mail(user, subject, newTransaction).directDeposit();

    return res.status(200).json({
      status: 'success',
      data: {
        transaction: newTransaction,
        balance: user.balance,
        profit: user.profit,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { wallet, amount: rawAmount } = req.body;
    const amount = parseInt(rawAmount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid transfer amount',
      });
    }

    const recipient = await User.findOne({ email: wallet }).session(session);
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient not found',
      });
    }

    const user = req.user.id;

    if (user.sendMoneyStatus === false) {
      return res.status(400).json({
        status: 'fail',
        message:
          'This user can no longer perform this action! Contact support for more info',
      });
    }

    const sender = await User.findById(req.user.id).session(session);
    const totalDeduction = amount;

    if (sender.balance < totalDeduction) {
      return res.status(400).json({
        status: 'fail',
        message: 'Insufficient balance',
      });
    }

    // Update balances
    recipient.balance += amount;
    await recipient.save({ session });

    sender.balance -= totalDeduction;
    await sender.save({ session });

    // Log the transaction
    const transaction = await Transaction.create(
      [
        {
          amount,
          type: 'transfer',
          wallet,
          status: 'confirmed',
          user: sender.id,
          address: null,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    const subject = 'Transfer successful';

    await new Mail(user, subject, transaction).sendConfirmedTransaction();

    return res.status(200).json({
      status: 'success',
      message: 'Transfer successful!',
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred during the transfer',
    });
  } finally {
    session.endSession();
  }
};

exports.exchange = async (req, res) => {
  const currentUser = req.user.id;

  const { from, to, amount } = req.body;

  console.log(from, to);

  if (from === to) {
    return res.status(400).json({
      status: 'fail',
      message: 'Cannot perform this transaction',
    });
  }

  try {
    const user = await User.findById(currentUser);

    console.log(user);
    if (from === 'profit') {
      user.profit -= parseInt(amount);
      user.balance += parseInt(amount);
    }

    if (from === 'balance') {
      user.profit += parseInt(amount);
      user.balance -= parseInt(amount);
    }

    await user.save();

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.addCashback = async (req, res) => {
  const { user } = req.params;

  const { amount } = req.body;

  if (!amount)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Amount is required' });

  try {
    const newCashback = await Transaction.create({
      amount,
      user: user.id,
      type: 'system',
      wallet: 'cashback',
      status: 'confirmed',
    });

    user.balance += Number(amount);
    await user.save();

    // send mail to the user
    const subject = '';
    await new Mail(user, subject, newCashback).cashbackMail();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
