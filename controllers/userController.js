const User = require('../models/user');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

let customErrors = null;

exports.index = async (req, res, next) => {
  const user = req.user;
  res.render('index', {user: user})
}

exports.login_get = async (req, res, next) => {
  res.render('loginForm', {
    user: null,
    errors: customErrors
  })

  customErrors = null;
}

exports.login_post = [
  body('username', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    customErrors = validationResult(req).array();

    if (customErrors.length) {
      return res.redirect('/login')
    }

    try {
      const user = await User.findOne({username: req.body.username});
      if (user) {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          return req.login(user, () => res.redirect('/home'));
        }
      }
      customErrors = [new Error('Invalid username or password')];
      return res.redirect('/login')
    } catch (error) {
      return next(error);
    }
  }
]

exports.log_out_get = async (req, res, next) => {
  await req.logout();
  await req.session.destroy();
  await res.clearCookie('connect.sid');
  res.redirect('/home');
}


exports.sign_up_get = async (req, res, next) => {
  try {
    res.render('sign-up_form', {
      user: null,
      errors: customErrors
    })

    customErrors = null;
  } catch (error) {
    next(error);
  }
}

exports.sign_up_post = [
  body('firstName', 'FirstName must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('lastName', 'LastName must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('username', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    customErrors = validationResult(req).array();

    if (customErrors.length) {
      return res.redirect('/sign-up')
    }

    if (req.body.password !== req.body.confirmPassword) {
      customErrors = [new Error('The Password and the confirm password fields must have the same values.')];
      return res.redirect('/sign-up')
    }

    if (checkUserExists(req.body.username)) {
      customErrors = [new Error('Such a user already exists.')];
      return res.redirect('/sign-up')
    }
    
    try {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword
        }).save(() => {
          next()
        })
      })
    } catch (error) {
      next(error);
    }
  }
]

async function checkUserExists(username) {
  const user = await User.findOne({username: username});
  return user ? true : false;
}