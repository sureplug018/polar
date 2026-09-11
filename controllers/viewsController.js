const Plan = require('../models/planModel');
const Transaction = require('../models/transactionsModel');
const Investment = require('../models/investmentModel');
const User = require('../models/userModel');
const Kyc = require('../models/kycModel');
const Wallet = require('../models/walletsModel');
const Support = require('../models/supportModel');
const Message = require('../models/messageModel');
const { getRates, convert, formatMoney } = require('../utilities/currency');
const Card = require('../models/cardModel');
const houses = require('../data');

// function formatCurrency(amount) {
//   if (amount == null || isNaN(amount)) return 'N/A';
//   const num = Number(amount);
//   if (Number.isInteger(num)) {
//     return num.toLocaleString('en-US'); // e.g., 5000 → "5,000"
//   }
//   return num.toLocaleString('en-US', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }); // e.g., 5000.567 → "5,000.57"
// }

exports.homePage = async (req, res) => {
  try {
    const user = res.locals.user;

    // 1. Read currency (query has priority)
    let currency = (
      req.query.currency ||
      req.cookies.currency ||
      'USD'
    ).toUpperCase();
    const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
    if (!allowed.includes(currency)) currency = 'USD';

    // 2. Save it
    res.cookie('currency', currency, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    // 3. Get rates
    const rates = await getRates('USD');

    // 4. Helper
    const formatCurrency = (amount) => {
      if (amount == null || isNaN(amount)) return formatMoney(0, currency);
      const converted = convert(amount, 'USD', currency, rates);
      return formatMoney(converted, currency);
    };

    const plans = await Plan.find().sort({ min: 1 });
    return res.status(200).render('index', {
      user,
      title: 'Home',
      plans,
      formatCurrency,
      currency,
      rates,
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.about = async (req, res) => {
  try {
    const user = res.locals.user;

    const plans = await Plan.find();
    return res.status(200).render('about', {
      user,
      title: 'About Us',
      plans,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.realEstate = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('real-estate', {
      user,
      title: 'Real Estate Properties',
      image: 'real-estate.jpg',
      houses,
      description:
        'Invest in properties with expert guidance to maximize value and secure stable returns through strategic real estate planning.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.realEstateHouses = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('real-estate-houses', {
      user,
      title: 'Homes for Sale',
      houses,
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.realEstateHouseDetails = async (req, res) => {
  try {
    const user = res.locals.user;
    const house = houses.find((item) => item.id === req.params.id);

    if (!house) {
      return res.status(404).render('404', {
        title: 'Property Not Found',
        message: 'The property you are looking for is no longer available.',
      });
    }

    return res.status(200).render('real-estate-house-details', {
      user,
      title: house.name,
      house,
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.cloudMining = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('cloud-mining', {
      user,
      title: 'Cloud Mining',
      image: 'cloud-mining.jpg',
      description:
        'Profit from non-farm payroll data releases with tailored trading strategies to navigate economic market movements.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.cryptoInvestment = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('crypto-investment', {
      user,
      title: 'Crypto Investment',
      image: 'crypto.jpg',
      description:
        'Capitalize on digital assets with strategic insights and risk management in the volatile crypto market.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.plans = async (req, res) => {
  try {
    const user = res.locals.user;
    const plans = await Plan.find().sort({ min: 1 });

    // 1. Read currency (query has priority)
    let currency = (
      req.query.currency ||
      req.cookies.currency ||
      'USD'
    ).toUpperCase();
    const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
    if (!allowed.includes(currency)) currency = 'USD';

    // 2. Save it
    res.cookie('currency', currency, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    // 3. Get rates
    const rates = await getRates('USD');

    // 4. Helper
    const formatCurrency = (amount) => {
      if (amount == null || isNaN(amount)) return formatMoney(0, currency);
      const converted = convert(amount, 'USD', currency, rates);
      return formatMoney(converted, currency);
    };

    return res.status(200).render('plans', {
      user,
      title: 'Investment Plans',
      plans,
      formatCurrency,
      currency,
      rates,
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.gold = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('gold', {
      user,
      title: 'Gold',
      image: 'gold.jpeg',
      description:
        'Preserve wealth with gold investments, a stable asset offering security in uncertain economic conditions.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.loan = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('loan', {
      user,
      title: 'Loan',
      image: 'loan.jpg',
      description:
        'Earn steady income through secured loan investments with predictable returns and managed risk for stability.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.charity = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('charity', {
      user,
      title: 'Charity',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.hedgeFund = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('hedge-fund', {
      user,
      title: 'Hedge Fund',
      image: 'hedge-fund.jpg',
      description:
        'Achieve consistent returns with sophisticated hedge fund strategies, active management, and risk mitigation.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.stock = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('stock-investment', {
      user,
      title: 'Stock Investment',
      image: 'stock.jpg',
      description:
        'Grow wealth with diversified stock portfolios, real-time analytics, and expert insights for long-term returns.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.services = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('services', {
      user,
      title: 'All Services',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.agriculture = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('agriculture', {
      user,
      title: 'Agriculture',
      image: 'agriculture.jpg',
      description:
        'Support sustainable farming with strategic investments in agriculture for profitability and food security.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.medicalCannabis = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('medical-cannabis', {
      user,
      title: 'Medical Cannabis',
      image: 'medical-cannabis.webp',
      description:
        'Invest in the growing medical cannabis industry with regulatory expertise and innovative strategies.',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.terms = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('terms-conditions', {
      user,
      title: 'Terms & Conditions',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.privacy = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('privacy-policy', {
      user,
      title: 'Privacy Policy',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.faq = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('faq', {
      user,
      title: 'FAQ',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.contactUs = async (req, res) => {
  try {
    const user = res.locals.user;

    return res.status(200).render('contact', {
      user,
      title: 'Contact Us',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    return res.status(200).render('login', {
      title: 'Sign In',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { refcode } = req.query;
    return res.status(200).render('register', {
      title: 'Register',
      refcode,
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    return res.status(200).render('forgot-password', {
      title: 'Forgot Password',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    return res.status(200).render('reset-password', {
      title: 'Reset Password',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    return res.status(200).render('confirmEmail', {
      title: 'Confirm Email',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.confirmedEmail = async (req, res) => {
  try {
    return res.status(200).render('email-confirmed', {
      title: 'Confirm Email',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.userDashboard = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };

      const transactions = await Transaction.find({ user: user.id }).sort({
        createdAt: -1,
      });
      const totalTransactions = await Transaction.find({
        user: user.id,
        status: 'confirmed',
      }).sort({
        createdAt: -1,
      });
      const deposits = await Transaction.find({
        user: user.id,
        type: 'deposit',
        status: 'confirmed',
      });
      const withdrawals = await Transaction.find({
        user: user.id,
        type: 'withdrawal',
        status: 'confirmed',
      });
      const transfers = await Transaction.find({
        user: user.id,
        type: 'transfer',
      });
      const message = await Message.findOne({ user: user.id });
      const investments = await Investment.find({ user: user.id });

      return res.status(200).render('dashboard', {
        title: 'User Dashboard',
        user,
        transactions,
        deposits,
        withdrawals,
        investments,
        transfers,
        totalTransactions,
        message,
        formatCurrency, // ← pass the helper
        currency, // optional – useful for the selector
        rates, // optional
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    console.error(err);
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.investmentPlans = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const plans = await Plan.find().sort({ min: 1 });
      return res.status(200).render('investment-plans', {
        title: 'Investment Packages',
        user,
        plans,
        formatCurrency,
        rates,
        currency,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.cards = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user) {
      const wallets = await Wallet.find({
        user: { $exists: false },
      });
      const card = await Card.findOne().sort({ createdAt: -1 });

      return res.status(200).render('cards', {
        title: 'Get a Card',
        user,
        wallets,
        card,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.investmentHistory = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const investments = await Investment.find({ user: user.id }).sort({
        createdAt: -1,
      });

      const completedInvestments = await Investment.find({
        user: user.id,
        status: 'ended',
      }).sort({
        createdAt: -1,
      });

      const totalInvestments = investments.reduce(
        (total, investment) => total + investment.amount,
        0,
      );

      return res.status(200).render('investments', {
        title: 'Investment Logs',
        user,
        investments,
        completedInvestments,
        totalInvestments,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user) {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const kyc = await Kyc.findOne({ user: user.id });
      return res.status(200).render('profile', {
        title: 'Profile Settings',
        user,
        kyc,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.myWallets = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user) {
      const wallets = await Wallet.find({ user: user.id });

      return res.status(200).render('allWallets', {
        title: 'Wallets',
        user,
        wallets,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.referral = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      // 1. Get all users referred by the current user
      const referrals = await User.find({ referral: user.myReferralCode });

      let totalReferralEarnings = 0;

      // 2. For each referral, find their first confirmed deposit
      for (const referral of referrals) {
        const firstDeposit = await Transaction.findOne({
          user: referral._id, // or userId, depending on your schema
          status: 'confirmed', // adjust status name if different
          type: 'deposit', // ensure it's a deposit
        }).sort({ createdAt: 1 }); // oldest first = first deposit

        if (firstDeposit) {
          // 3. Add 10% of the first deposit amount
          totalReferralEarnings += firstDeposit.amount * 0.1;
        }
      }

      const activeReferrals = referrals.filter(
        (referral) => referral.status === 'active',
      );

      return res.status(200).render('referrals', {
        title: 'Referral Program',
        user,
        referrals,
        activeReferrals,
        totalReferralEarnings, // pass it to the view
        totalReferralEarningsFormatted: formatCurrency(totalReferralEarnings), // formatted version
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.sendMoney = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      return res.status(200).render('send-money', {
        title: 'Send Money',
        user,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.transactionHistory = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const transactions = await Transaction.find({ user: user.id }).sort({
        createdAt: -1,
      });
      return res.status(200).render('transactions', {
        title: 'Transaction Logs',
        user,
        transactions,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.withdrawMoney = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    // 1. Read currency (query has priority)
    let currency = (
      req.query.currency ||
      req.cookies.currency ||
      'USD'
    ).toUpperCase();
    const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
    if (!allowed.includes(currency)) currency = 'USD';

    // 2. Save it
    res.cookie('currency', currency, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    // 3. Get rates
    const rates = await getRates('USD');

    // 4. Helper
    const formatCurrency = (amount) => {
      if (amount == null || isNaN(amount)) return formatMoney(0, currency);
      const converted = convert(amount, 'USD', currency, rates);
      return formatMoney(converted, currency);
    };

    const pendingWithdrawals = await Transaction.find({
      user: user.id,
      type: 'withdrawal',
      status: 'pending',
    });

    const totalPendingWithdrawals = pendingWithdrawals.reduce(
      (total, withdrawal) => total + withdrawal.amount,
      0,
    );

    const totalWithdrawn = await Transaction.aggregate([
      {
        $match: {
          user: user.id,
          type: 'withdrawal',
          status: 'confirmed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    if (user.role === 'user') {
      const wallets = await Wallet.find({ user: user.id, status: 'active' });
      return res.status(200).render('withdraw', {
        title: 'Withdraw Funds',
        user,
        wallets,
        totalPendingWithdrawals,
        totalWithdrawn,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

// exports.deposit = async (req, res) => {
//   try {
//     let user;
//     if (req.query.userId) {
//       user = await User.findById(req.query.userId);
//     } else {
//       user = res.locals.user;
//     }

//     if (!user) {
//       return res.status(302).redirect('/sign-in');
//     }

//     if (user.role === 'user') {
//       const wallets = await Wallet.find();
//       return res.status(200).render('deposit', {
//         title: 'Make Deposit',
//         user,
//         wallets,
//       });
//     }
//     return res.status(302).redirect('/sign-in');
//   } catch (err) {
//     return res.status(500).render('404', {
//       title: 'Error',
//       message: 'Something went wrong',
//     });
//   }
// };

exports.deposit = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const plans = await Plan.find().sort({ min: 1 });
      const wallets = await Wallet.find({
        user: { $exists: false },
      });
      return res.status(200).render('invest', {
        title: 'Investment',
        user,
        plans,
        wallets,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.walletExchange = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      return res.status(200).render('walletExchange', {
        title: 'Wallet Exchange',
        user,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.invest = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const plans = await Plan.find().sort({ minn: 1 });
      return res.status(200).render('invest', {
        title: 'Investment',
        user,
        plans,
        formatCurrency,
        currency,
        rates,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.sendSupport = async (req, res) => {
  try {
    let user;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else {
      user = res.locals.user;
    }

    if (!user) {
      return res.status(302).redirect('/sign-in');
    }

    if (user.role === 'user') {
      const supports = await Support.find({ userId: user.id }).sort({
        createdAt: -1,
      });
      return res.status(200).render('support', {
        title: 'Contact Support',
        user,
        supports,
      });
    }
    return res.status(302).redirect('/sign-in');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

/////////////////////////
//ADMIN
exports.adminDashboard = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const transactions = await Transaction.find().sort({ createdAt: -1 });
      const deposits = await Transaction.find({
        type: 'deposit',
      });
      const withdrawals = await Transaction.find({
        type: 'withdrawal',
      });
      const transfers = await Transaction.find({
        type: 'transfer',
      });
      const users = await User.find().sort({ createdAt: -1 });
      const investments = await Investment.find();
      const pendingVerifications = await User.find({ confirmed: false });

      const supports = await Support.find();

      return res.status(200).render('admin-dashboard', {
        user,
        title: 'Admin Dashboard',
        transactions,
        deposits,
        withdrawals,
        transfers,
        investments,
        supports,
        formatCurrency,
        users,
        pendingVerifications,
        currency,
        rates,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.adminSignIn = async (req, res) => {
  try {
    const user = res.locals.user;
    return res.status(200).render('admin-sign-in', {
      user,
      title: 'Admin Login',
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.allInvestments = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const filter = {};

      // Search by user email
      if (req.query.email) {
        const users = await User.find({
          email: { $regex: req.query.email, $options: 'i' },
        }).select('_id');

        const userIds = users.map((u) => u._id);
        filter.user = { $in: userIds };
      }

      const totalInvestments = await Investment.countDocuments(filter);
      const totalPages = Math.ceil(totalInvestments / limit);

      const investments = await Investment.find(filter)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).render('admin-investments', {
        title: 'Investments',
        user,
        investments,
        formatCurrency,
        query: req.query,
        currentPage: page,
        totalPages,
        totalInvestments,
        currency,
        rates,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.allPlans = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      const plans = await Plan.find();
      return res.status(200).render('admin-plans', {
        title: 'Investment Plans',
        user,
        plans,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.allSupports = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      const supports = await Support.find();
      return res.status(200).render('admin-support', {
        title: 'Supports',
        user,
        supports,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.allTransactions = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.redirect('/admin/sign-in');
    }

    if (user.role !== 'admin') {
      return res.redirect('/');
    }

    // 1. Read currency (query has priority)
    let currency = (
      req.query.currency ||
      req.cookies.currency ||
      'USD'
    ).toUpperCase();
    const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
    if (!allowed.includes(currency)) currency = 'USD';

    // 2. Save it
    res.cookie('currency', currency, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    // 3. Get rates
    const rates = await getRates('USD');

    // 4. Helper
    const formatCurrency = (amount) => {
      if (amount == null || isNaN(amount)) return formatMoney(0, currency);
      const converted = convert(amount, 'USD', currency, rates);
      return formatMoney(converted, currency);
    };

    const { email, type, status } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments();
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find(filter)
      .populate('user') // optional if you need user data
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).render('admin-transactions', {
      title: 'Transactions',
      user,
      transactions,
      formatCurrency,
      query: req.query,
      // Pagination data
      currentPage: page,
      totalPages,
      totalTransactions,
      currency,
      rates,
    });
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      // 1. Read currency (query has priority)
      let currency = (
        req.query.currency ||
        req.cookies.currency ||
        'USD'
      ).toUpperCase();
      const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
      if (!allowed.includes(currency)) currency = 'USD';

      // 2. Save it
      res.cookie('currency', currency, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      // 3. Get rates
      const rates = await getRates('USD');

      // 4. Helper
      const formatCurrency = (amount) => {
        if (amount == null || isNaN(amount)) return formatMoney(0, currency);
        const converted = convert(amount, 'USD', currency, rates);
        return formatMoney(converted, currency);
      };
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const emailQuery = req.query.email || '';

      // Build filter
      const filter = {};
      if (emailQuery) {
        filter.email = { $regex: emailQuery, $options: 'i' }; // case-insensitive partial match
      }

      // Get total count for pagination
      const totalUsers = await User.countDocuments(filter);
      const totalPages = Math.ceil(totalUsers / limit);

      // Fetch paginated users
      const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).render('admin-users', {
        title: 'Users',
        user,
        users,
        formatCurrency,
        // Pagination data
        currentPage: page,
        query: req.query,
        totalPages,
        totalUsers,
        emailQuery, // so the search input can keep the value
        currency,
        rates,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.adminUserDetail = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) return res.redirect('/signin');
    if (user.role !== 'admin') return res.redirect('/signin');

    const userId = req.params.id;
    const userDetail = await User.findById(userId);

    if (!userDetail) {
      return res.redirect('/admin/users');
    }

    // 1. Read currency (query has priority)
    let currency = (
      req.query.currency ||
      req.cookies.currency ||
      'USD'
    ).toUpperCase();
    const allowed = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY'];
    if (!allowed.includes(currency)) currency = 'USD';

    // 2. Save it
    res.cookie('currency', currency, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    // 3. Get rates
    const rates = await getRates('USD');

    // 4. Helper
    const formatCurrency = (amount) => {
      if (amount == null || isNaN(amount)) return formatMoney(0, currency);
      const converted = convert(amount, 'USD', currency, rates);
      return formatMoney(converted, currency);
    };

    // Pagination settings
    const limit = 10;

    const txPage = parseInt(req.query.txPage) || 1;
    const invPage = parseInt(req.query.invPage) || 1;
    const refPage = parseInt(req.query.refPage) || 1;
    const walletPage = parseInt(req.query.walletPage) || 1;

    // ===== Transactions =====
    const txFilter = { user: userDetail._id };
    const totalTransactions = await Transaction.countDocuments(txFilter);
    const totalTxPages = Math.ceil(totalTransactions / limit);

    const userTransactions = await Transaction.find(txFilter)
      .sort({ createdAt: -1 })
      .skip((txPage - 1) * limit)
      .limit(limit);

    // ===== Investments =====
    const invFilter = { user: userDetail._id };
    const totalInvestments = await Investment.countDocuments(invFilter);
    const totalInvPages = Math.ceil(totalInvestments / limit);

    const userInvestments = await Investment.find(invFilter)
      .sort({ createdAt: -1 })
      .skip((invPage - 1) * limit)
      .limit(limit);

    // ===== Referrals =====
    const refFilter = { referralCode: userDetail.myReferralCode };
    const totalReferrals = await User.countDocuments(refFilter);
    const totalRefPages = Math.ceil(totalReferrals / limit);

    const userReferrals = await User.find(refFilter)
      .sort({ createdAt: -1 })
      .skip((refPage - 1) * limit)
      .limit(limit);

    // ===== Wallets =====
    const walletFilter = { user: userDetail._id };
    const totalWallets = await Wallet.countDocuments(walletFilter);
    const totalWalletPages = Math.ceil(totalWallets / limit);

    const userWallets = await Wallet.find(walletFilter)
      .skip((walletPage - 1) * limit)
      .limit(limit);

    // ===== Totals (for stats) =====
    const userDeposits = await Transaction.find({
      type: 'deposit',
      status: 'confirmed',
      user: userDetail._id,
    });

    const totalUserDepositAmount = userDeposits.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0,
    );

    const userWithdrawal = await Transaction.find({
      type: 'withdrawal',
      status: 'confirmed',
      user: userDetail._id,
    });

    const totalUserWithdrawalAmount = userWithdrawal.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0,
    );

    const message = await Message.findOne({ user: userDetail.id });

    return res.render('admin-userDetails', {
      title: 'Admin User Detail',
      user,
      userDetail,
      transactions: userTransactions,
      investments: userInvestments,
      referrals: userReferrals,
      wallets: userWallets,
      deposits: userDeposits,
      totalUserDepositAmount,
      totalUserWithdrawalAmount,
      message,
      formatCurrency,
      currency,
      rates,

      // Pagination data
      txPage,
      totalTxPages,
      invPage,
      totalInvPages,
      refPage,
      totalRefPages,
      walletPage,
      totalWalletPages,
      query: req.query,
    });
  } catch (err) {
    console.log(err);
    return res.redirect('/signin');
  }
};

exports.allWallets = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      const wallets = await Wallet.find({ user: { $exists: false } });
      return res.status(200).render('admin-wallets', {
        title: 'Wallets',
        user,
        wallets,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.addPlan = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      return res.status(200).render('add-plan', {
        title: 'Add Plan',
        user,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.addWallet = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user) {
      return res.status(200).render('add-wallet', {
        user,
        title: 'Add  Wallet',
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.kycManagement = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      const allKyc = await Kyc.find();
      return res.status(200).render('kyc-management', {
        user,
        title: 'KYC management',
        allKyc,
      });
    }

    return res.status(302).redirect('/');
  } catch (error) {
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.adminCards = async (req, res) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(302).redirect('/admin/sign-in');
    }

    if (user.role === 'admin') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {};

      const { status, email } = req.query;

      // Optional status filter
      if (status) {
        filter.status = status;
      }

      // Filter by user email
      if (email) {
        const matchedUsers = await User.find({
          email: { $regex: email, $options: 'i' },
        }).select('_id');

        filter.user = { $in: matchedUsers.map((u) => u._id) };
      }

      // Total count for pagination
      const totalCards = await Card.countDocuments(filter);
      const totalPages = Math.ceil(totalCards / limit);

      const allCards = await Card.find(filter)
        .populate('user')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).render('admin-cards', {
        title: 'Cards',
        user,
        cards: allCards,
        query: req.query,
        // Pagination data
        currentPage: page,
        totalPages,
        totalCards,
        formatCurrency,
      });
    }

    return res.status(302).redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(500).render('404', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};
