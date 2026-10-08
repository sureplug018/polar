// Cloud mining hardware offered on the Polaris hosting floor, grouped by grade.
// Prices are in USD and converted to the visitor's currency in the view.
const miningGrades = [
  {
    grade: 'Grade C',
    tier: 'Entry',
    summary:
      'Proven, cost-efficient units for first-time miners who want steady exposure at a low entry price.',
    machines: [
      {
        name: 'Bitmain Antminer S19j Pro',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '104 TH/s',
        power: '3,068 W',
        efficiency: '29.5 J/TH',
        price: 690,
      },
      {
        name: 'MicroBT Whatsminer M30S++',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '112 TH/s',
        power: '3,472 W',
        efficiency: '31 J/TH',
        price: 760,
      },
      {
        name: 'Bitmain Antminer E9 Pro',
        algorithm: 'Etchash',
        coin: 'ETC',
        hashrate: '3.68 GH/s',
        power: '2,200 W',
        efficiency: '0.6 J/MH',
        price: 1450,
      },
    ],
  },
  {
    grade: 'Grade B',
    tier: 'Standard',
    summary:
      'Balanced machines with strong efficiency, suited to investors building a consistent daily output.',
    machines: [
      {
        name: 'MicroBT Whatsminer M50S',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '126 TH/s',
        power: '3,276 W',
        efficiency: '26 J/TH',
        price: 1280,
      },
      {
        name: 'Bitmain Antminer S19 XP',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '141 TH/s',
        power: '3,010 W',
        efficiency: '21.3 J/TH',
        price: 1650,
      },
      {
        name: 'Bitmain Antminer KS5 Pro',
        algorithm: 'kHeavyHash',
        coin: 'KAS',
        hashrate: '21 TH/s',
        power: '3,150 W',
        efficiency: '150 J/TH',
        price: 2400,
      },
    ],
  },
  {
    grade: 'Grade A',
    tier: 'Professional',
    summary:
      'Latest-generation air-cooled hardware delivering high hashrate per watt for serious portfolios.',
    machines: [
      {
        name: 'MicroBT Whatsminer M60S',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '186 TH/s',
        power: '3,441 W',
        efficiency: '18.5 J/TH',
        price: 3150,
      },
      {
        name: 'Bitmain Antminer S21',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '200 TH/s',
        power: '3,500 W',
        efficiency: '17.5 J/TH',
        price: 3480,
      },
      {
        name: 'Bitmain Antminer L9',
        algorithm: 'Scrypt',
        coin: 'LTC / DOGE',
        hashrate: '16 GH/s',
        power: '3,360 W',
        efficiency: '0.21 J/MH',
        price: 5900,
      },
    ],
  },
  {
    grade: 'Grade A+',
    tier: 'Enterprise',
    summary:
      'Flagship and hydro-cooled units for institutional-scale allocations with maximum output.',
    machines: [
      {
        name: 'Bitmain Antminer S21 Pro',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '234 TH/s',
        power: '3,510 W',
        efficiency: '15 J/TH',
        price: 4980,
      },
      {
        name: 'Bitmain Antminer S21 XP',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '270 TH/s',
        power: '3,645 W',
        efficiency: '13.5 J/TH',
        price: 6850,
      },
      {
        name: 'Bitmain Antminer S21 XP Hydro',
        algorithm: 'SHA-256',
        coin: 'BTC',
        hashrate: '473 TH/s',
        power: '5,676 W',
        efficiency: '12 J/TH',
        price: 11900,
      },
    ],
  },
];

module.exports = miningGrades;
