const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/register', viewsController.register);

router.get('/sign-in', viewsController.signIn);

router.get('/confirm-email', viewsController.confirmEmail);

router.get('/reset-password/:token', viewsController.resetPassword);

router.get(
  '/confirm-email/:token',
  authController.confirmEmailFE,
  viewsController.confirmedEmail,
);

router.get('/forgot-password', viewsController.forgotPassword);

router.use(authController.isLoggedIn);

router.get('/', viewsController.homePage);

router.get('/about-us', viewsController.about);

router.get('/plans', viewsController.plans);

router.get('/services', viewsController.services);

router.get('/services/agriculture', viewsController.agriculture);

router.get('/services/medical-cannabis', viewsController.medicalCannabis);

router.get('/services/real-estate', viewsController.realEstate);

router.get('/services/hedge-fund', viewsController.hedgeFund);

router.get('/services/cryptocurrency', viewsController.cryptoInvestment);

router.get('/services/gold-mining', viewsController.gold);

router.get('/services/stock-investment', viewsController.stock);

router.get('/services/cloud-mining', viewsController.cloudMining);

router.get('/services/loan', viewsController.loan);

router.get('/charity', viewsController.charity);

router.get('/faq', viewsController.faq);

router.get('/contact-us', viewsController.contactUs);

router.get('/legals/terms-conditions', viewsController.terms);

router.get('/legals/privacy-policy', viewsController.privacy);

////////////////////////////////////
// User dashboard

router.get('/dashboard', viewsController.userDashboard);

router.get('/investment-packages', viewsController.investmentPlans);

router.get('/investments', viewsController.investmentHistory);

router.get('/profile', viewsController.userProfile);

router.get('/referrals', viewsController.referral);

router.get('/send-funds', viewsController.sendMoney);

router.get('/transactions', viewsController.transactionHistory);

router.get('/withdraw', viewsController.withdrawMoney);

router.get('/deposit', viewsController.deposit);

router.get('/wallet-exchange', viewsController.walletExchange);

router.get('/wallets', viewsController.myWallets);

router.get('/invest', viewsController.invest);

router.get('/support', viewsController.sendSupport);

/////////////////////////
// ADMIN
router.get('/admin/dashboard', viewsController.adminDashboard);

router.get('/admin/sign-in', viewsController.adminSignIn);

router.get('/admin/transactions', viewsController.allTransactions);

router.get('/admin/users', viewsController.allUsers);

router.get('/admin/users/:id', viewsController.adminUserDetail);

router.get('/admin/investments', viewsController.allInvestments);

router.get('/admin/wallets', viewsController.allWallets);

router.get('/admin/plans', viewsController.allPlans);

router.get('/admin/support', viewsController.allSupports);

router.get('/add-wallet', viewsController.addWallet);

router.get('/admin/add-plan', viewsController.addPlan);

router.get('/admin/kyc-management', viewsController.kycManagement);

module.exports = router;
