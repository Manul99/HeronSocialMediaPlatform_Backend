const express = require('express');
const passport = require('passport');
const { assignChild, getParentOverview, updateRestrictions, registerParent, parentLogin, requestPasswordResetWithOTP } = require('../controllers/ParentController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post("/create", authMiddleware,assignChild);
router.get("/paretOverview",authMiddleware,getParentOverview);
router.put("/:childId",authMiddleware,updateRestrictions);

router.post('/register',registerParent);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/dashboard'); // or your frontend redirect
    }
);

router.post('/login',parentLogin);



module.exports = router;