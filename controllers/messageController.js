const Message = require('./../models/messageModel');

exports.createMessage = async (req, res) => {
  try {
    const { title, message, status, user } = req.body;


    if (!title || !message || !status) {
      return res.status(400).json({
        status: 'fail',
        message: 'A message must have a title, text and status',
      });
    }

    const newMessage = await Message.create({
      title,
      message,
      status,
      user,
    });
    res.status(201).json({
      status: 'success',
      data: {
        message: newMessage,
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

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted message',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();

    res.status(200).json({
      status: 'success',
      result: messages.length,
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const { title, message, status } = req.body;

    const currentMessage = await Message.findById(messageId);

    if (!currentMessage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Message not found',
      });
    }

    if (title) currentMessage.title = title;
    if (message) currentMessage.message = message;
    if (status) currentMessage.status = status;

    await currentMessage.save();

    return res.status(200).json({
      status: 'success',
      message: 'Successfully edited message',
      message,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
