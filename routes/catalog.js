const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const passport = require('../controllers/authenticate');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

router.use(passport.initialize());
router.use(passport.session());

//userController

router.get('/home', userController.index)

router.get('/sign-up', userController.sign_up_get);

router.post('/sign-up', userController.sign_up_post, passport.authenticate('local', {failureRedirect: '/sign-up', successRedirect: '/home' }));

router.get('/login', userController.login_get);

router.post('/login', userController.login_post);

router.get('/logout', userController.log_out_get)

//messageController

router.get('/chat', messageController.chat_get);

router.post('/chat', messageController.chat_post);

module.exports = router;