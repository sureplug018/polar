let cachedRates = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getRates(base = 'USD') {
  const now = Date.now();
  if (cachedRates && now - lastFetch < CACHE_TTL) {
    return cachedRates;
  }

  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v2/rates?base=${base}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    // Frankfurter v2 returns an ARRAY of {quote, rate, ...}
    const rates = { [base]: 1 };

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.quote && item.rate) {
          rates[item.quote] = item.rate;
        }
      });
    }

    cachedRates = rates;
    lastFetch = now;
    // console.log('Rates loaded successfully. EUR =', rates.EUR);
    return rates;
  } catch (err) {
    console.error('Failed to fetch rates:', err.message);
    // Fallback so the site never breaks
    return (
      cachedRates || {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        NGN: 1600,
        CAD: 1.37,
        AUD: 1.52,
        JPY: 149,
      }
    );
  }
}

function convert(amount, from, to, rates) {
  if (from === to) return Number(amount) || 0;
  const rateFrom = rates[from] || 1;
  const rateTo = rates[to] || 1;
  return (Number(amount) / rateFrom) * rateTo;
}

function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

module.exports = { getRates, convert, formatMoney };
