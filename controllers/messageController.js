const User = require('../models/user');
const Message = require('../models/message');

const { body, validationResult } = require('express-validator');

exports.chat_get = async (req, res, next) => {
  const messages = await Message.find().populate('author');
  res.render('chat', {
    user: req.user,
    messages: messages
  })
}

exports.chat_post = async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/chat');
  }

  try {
    const message = new Message({
      title: req.body.title,
      time: new Date(),
      text: req.body.text,
      author: req.user._id
    }).save(() => {
      res.redirect('/chat');
    })
  } catch (error) {
    next(error)
  }
}