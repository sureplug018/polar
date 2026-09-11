const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');
const kycRoutes = require('./routes/kycRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const walletRoutes = require('./routes/walletRoutes');
const planRoutes = require('./routes/planRoutes');
const messageRoutes = require('./routes/messageRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const currencyMiddleware = require('./middlewares/currency');
const cardRoutes = require('./routes/cardRoutes');

const app = express();
app.set('view engine', 'ejs');

if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
}

app.set('views', path.join(__dirname, 'views'));

// limiting the amount of requests from an IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this Ip, please try again in an hour!',
});

app.use('/api', limiter);

// limiting the amount of data that is parsed in body-parser by adding size in kb
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(currencyMiddleware);

// DATA SANITIZATION
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key in obj) {
      if (/^\$/.test(key) || /\./.test(key)) {
        const safeKey = key.replace(/^\$|\./g, '_');
        obj[safeKey] = obj[key];
        delete obj[key];
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', viewsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/supports', supportRoutes);
app.use('/api/v1/kyc', kycRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/investments', investmentRoutes);
app.use('/api/v1/cards', cardRoutes);

module.exports = app;
