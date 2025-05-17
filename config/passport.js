const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const parentController = require('../controllers/ParentController');
const Parents = require('../models/Parents');
// const User = require('../models/User');
// // Serialize user for session
// passport.serializeUser((user,done) =>{
//     done(null,user.id);
// });

// passport.deserializeUser(async(id,done) =>{
//     try {
//         const user = await User.findById(id);
//         done(null,user);
//     } catch (error) {
//         done(error);
//     }
// })

// //Google strategy
// passport.use(new GoogleStrategy({
//     clientID:process.env.GOOGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:process.env.GOOGLE_CALLBACK_URL,
//     scope:['profile','email']
// },async(accessToken,refreshToken,profile,done) =>{
//     try{
//         let user = await User.findOne({email:profile.emails[0].value});

//         if(!user){
//             user = await User.create({
//                 fullName: profile.displayName,
//                 username: profile.emails[0].value.split('@')[0],
//                 email: profile.emails[0].value,
//                 profileImage: profile.photos[0]?.value || '',
//                 userType: 'student',
//                 level: 1, 
//             })
//         }
//         done(null,user);
//     }catch(error){
//         done(error,null);
//     }
// })
// )
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const User = require('../models/User');
const app = express();

// Add session middleware BEFORE passport middleware
module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check existing users in both collections
      const [existingParent, existingUser] = await Promise.all([
        Parents.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] }),
        User.findOne({ email: profile.emails[0].value })
      ]);

      if (existingParent || existingUser) {
        return done(null, existingParent || existingUser);
      }

      // Create new parent
      const parent = new Parents({
        userName: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        children: []
      });

      await parent.save();

      // Create associated user
      const user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        role: 'parent',
        parentProfile: parent._id
      });

      await user.save();

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).populate('parentProfile');
      if (user) return done(null, user);
      
      const parent = await Parents.findById(id);
      done(null, parent);
    } catch (error) {
      done(error, null);
    }
  });
};