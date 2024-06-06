const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    userLogin,
    userRegister,
    userProfile
} = require('../../regulator/user/userApi');

router.get('/me', userProfile);
router.post('/login', passport.authenticate('local', { failureMessage: 'Wrong login or password'}, userLogin));
router.post('/signup', userRegister);

module.exports = router;