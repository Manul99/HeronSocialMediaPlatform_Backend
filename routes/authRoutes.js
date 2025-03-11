const express = require('express');
const passport = require('passport');
const { requestPasswordResetWithOTP, verifyOTPAndPassword, updatePassword } = require('../controllers/UserControllers');
const router = express.Router();

//Google auth Route
router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

//Google auth callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
})


// Forgot Password
router.post('/forgot-password',requestPasswordResetWithOTP);
router.post('/verifyOTP',verifyOTPAndPassword);
router.post('/updatePassword',updatePassword);

module.exports = router;