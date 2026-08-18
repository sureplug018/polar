const Plan = require('./../models/planModel');

exports.createPlan = async (req, res) => {
  try {
    const newPlan = await Plan.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        plan: newPlan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted plan',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();

    res.status(200).json({
      status: 'success',
      result: plans.length,
      data: {
        plans,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editPlan = async (req, res) => {
  try {
    const planId = req.params.id;

    const { name, roi, min, max, duration } = req.body;

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plan not found',
      });
    }

    if (name) plan.name = name;
    if (roi) plan.roi = roi;
    if (min) plan.min = min;
    if (max) plan.max = max;
    if (duration) plan.duration = duration;

    await plan.save();

    return res.status(200).json({
      status: 'success',
      message: 'Successfully edited plan',
      plan,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getPlan = async (req, res) => {
  try {
    const { planName } = req.params;
    const plan = await Plan.findOne({ name: planName });

    return res.status(200).json({
      status: 'success',
      data: {
        plan,
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
