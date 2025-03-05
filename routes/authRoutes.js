const express = require('express');
const passport = require('passport');
const router = express.Router();

//Google auth Route
router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

//Google auth callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
})

module.exports = router;