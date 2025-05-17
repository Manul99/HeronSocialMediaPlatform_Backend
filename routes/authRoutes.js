const express = require('express');
const passport = require('passport');
const { requestPasswordResetWithOTP, verifyOTPAndPassword, updatePassword } = require('../controllers/ParentController');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:3000/dashboard');
  }
);


// Forgot Password
router.post('/forgot-password',requestPasswordResetWithOTP);
router.post('/verifyOTP',verifyOTPAndPassword);
router.post('/updatePassword',updatePassword);

module.exports = router;