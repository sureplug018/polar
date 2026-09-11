const cardModel = require('../models/cardModel');
const Mail = require('../utilities/notificationEmail');
const User = require('../models/userModel');

function generateCardNumber(cardType = 'Visa card') {
  // Visa starts with 4, Mastercard starts with 5
  const prefix = cardType.toLowerCase() === 'Master card' ? '5' : '4';
  const randomDigits = Math.floor(Math.random() * 1000000000000000) // 15 digits
    .toString()
    .padStart(15, '0');
  return `${prefix}${randomDigits}`;
}

function generateExpirationDate() {
  const currentDate = new Date();
  const expirationYear = currentDate.getFullYear() + 3; // Set expiration year to 3 years from now
  const expirationMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get current month and pad with leading zero if necessary
  return `${expirationMonth}/${expirationYear.toString().slice(-2)}`; // Format as MM/YY
}

function generateCVV() {
  return Math.floor(Math.random() * 900 + 100).toString(); // Generate a random 3-digit CVV number
}

exports.applyForCard = async (req, res) => {
  try {
    const user = req.user;
    const { billingAddress, cardType, zipCode, amount, wallet, address } =
      req.body;

    // Create a new card document
    const newCard = await cardModel.create({
      user: user.id,
      cardNumber: generateCardNumber(req.body.cardType),
      expirationDate: generateExpirationDate(),
      cvv: generateCVV(),
      billingAddress,
      cardType,
      zipCode,
      wallet,
      address,
      amount,
      cardName: `${user.firstName} ${user.lastName}`,
    });

    const subject = 'New Card Application Received';

    const admin = await User.findOne({ role: 'admin' });

    // send email notification to the user about the card application status (pending)
    await new Mail(admin, subject, newCard).cardApplication();

    return res.status(201).json({
      status: 'success',
      data: {
        card: newCard,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.approveCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await cardModel.findById(cardId);

    if (!card) {
      return res.status(404).json({
        status: 'fail',
        message: 'Card not found',
      });
    }

    card.status = 'active';
    await card.save();

    res.status(200).json({
      status: 'success',
      data: {
        card,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateCardStatus = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await cardModel.findById(cardId);

    const { status } = req.body;

    if (!card) {
      return res.status(404).json({
        status: 'fail',
        message: 'Card not found',
      });
    }

    card.status = status;
    await card.save();

    return res.status(200).json({
      status: 'success',
      data: {
        card,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.declineCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await cardModel.findById(cardId);

    if (!card) {
      return res.status(404).json({
        status: 'fail',
        message: 'Card not found',
      });
    }

    card.status = 'inactive';
    await card.save();

    // Send email notification to the user about the card status update
    const subject = 'Card Status Update';
    const user = await User.findById(card.user);
    await new Mail(user, subject, card).declineCard();

    return res.status(200).json({
      status: 'success',
      data: {
        card,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.approveCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await cardModel.findById(cardId);

    if (!card) {
      return res.status(404).json({
        status: 'fail',
        message: 'Card not found',
      });
    }

    card.status = 'active';
    await card.save();

    // Send email notification to the user about the card status update
    const subject = 'Card Status Update';
    const user = await User.findById(card.user);
    await new Mail(user, subject, card).approveCard();

    return res.status(200).json({
      status: 'success',
      data: {
        card,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
