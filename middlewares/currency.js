// middleware/currency.js
const { getRates } = require('../utilities/currency');

const supported = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY']; // add what you need

async function currencyMiddleware(req, res, next) {
  // Get preferred currency from cookie (or query ?currency=EUR)
  let currency = req.cookies.currency || req.query.currency || 'USD';
  if (!supported.includes(currency)) currency = 'USD';

  // Save choice
  res.cookie('currency', currency, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year

  const rates = await getRates('USD'); // always base on USD (your prices are in $)

  res.locals.currency = currency;
  res.locals.rates = rates;
  res.locals.supportedCurrencies = supported;
  res.locals.convert = (amount) => {
    const converted = amount * (rates[currency] || 1);
    return converted;
  };
  res.locals.formatMoney = (amount) => {
    const converted = amount * (rates[currency] || 1);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(converted);
  };

  next();
}

module.exports = currencyMiddleware;
