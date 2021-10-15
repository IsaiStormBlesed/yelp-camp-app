const express =  require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser } = require('../controllers/users')

router.route('/register')
    .get(showRegisterForm)
    .post(catchAsync(registerUser))

router.route('/login')
    .get(showLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUser)

router.get('/logout', logoutUser)

module.exports = router;