const express = require('express');
const router = express.Router();
const passport = require('passport')

const {
    userLogin,
    renderLogin,
    userLogout,
    renderProfile,
    renderRegister,
    userRegister,
} = require('../regulator/user/userRender');

router.get('/profile', renderProfile);
router.get('/login', renderLogin);
router.post('/login', passport.authenticate('local', {failureRedirect: 'user/login'}), userLogin);
router.get('/register', renderRegister);
router.post('/register', userRegister);
router.get('/logout', userLogout);

module.exports = router;