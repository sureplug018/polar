/*const mongoose = require('mongoose');*/
const cron = require('node-cron');
const User = require('./models/userModel');
const Plan = require('./models/planModel');
const Investment = require('./models/investmentModel');

async function returnInvestment() {
  try {
    const investments = await Investment.find({ status: 'active' });
    const oneDayInMinutes = 1440; // 24 hours in minutes
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const nowInMinutes = now.getTime() / (1000 * 60);

    for (const investment of investments) {
      const plan = await Plan.findById(investment.plan);
      const dailyInterest = (plan.roi / 100) * investment.amount; // Daily ROI

      const createdAt = new Date(investment.createdAt);
      createdAt.setSeconds(0);
      createdAt.setMilliseconds(0);
      const createdAtInMinutes = createdAt.getTime() / (1000 * 60);

      // Calculate the time elapsed in minutes since investment was created
      const elapsedMinutes = nowInMinutes - createdAtInMinutes;

      // Check if a full day (1440 minutes) has passed since the last interest was added
      const daysPassed = Math.floor(elapsedMinutes / oneDayInMinutes);

      if (daysPassed === investment.count && investment.daysRemaining > 0) {
        // Add daily interest for each day that has passed
        const user = await User.findById(investment.user._id);
        user.profit += dailyInterest;

        await user.save();
        // Reduce the daysRemaining accordingly
        investment.daysRemaining -= 1;

        investment.count += 1;

        // Save the investment update
        await investment.save();

        console.log(
          `Added interest for day ${daysPassed} and reduced daysRemaining for investment: ${investment._id}`
        );

        // If investment duration is completed (daysRemaining reaches 0 or less)
        if (investment.daysRemaining <= 0) {
          investment.status = 'ended';
          await investment.save();

          console.log(investment.amount);

          // user.profit -= investment.amount;
          // user.balance += investment.amount;
          // user.profit -=
          //   ((investment.amount * plan.roi) / 100) * (investment.count - 1);
          // user.balance +=
          //   ((investment.amount * plan.roi) / 100) * (investment.count - 1);

          user.balance += user.profit;
          user.profit = 0;

          await user.save();

          console.log(`Investment completed and finalized: ${investment._id}`);
        }
      }
    }
  } catch (err) {
    console.error('Error processing investments:', err.message);
  }
}

// Schedule the cron job to run every minute
module.exports = function () {
  cron.schedule('* * * * *', () => {
    // This runs every minute
    returnInvestment();
  });
};
