const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');



// const jwtSecret= process.env.JWT_SECRET_KEY;
const googleClientId = "198550977680-6lajqq9n7lui7d32hfsd8ive7bdspvci.apps.googleusercontent.com";
const googleClientSecret = "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";
const googleCallbackUrl = "http://localhost:4000/auth/google/callback";

// Configure local strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isPasswordValid = await user.verifyPassword(password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid credentialsss' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configure Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in the database based on Google profile info
      
        
        let user = await userModel.findOne({ 'email': profile.emails[0].value });

        console.log("access  token ", accessToken);

        if (!user) {
          // If user does not exist, create a new user with Google profile info
          user = await userModel.create({
            google: {
              id: profile.id,
              email: profile.emails[0].value,
            },
            email: profile.emails[0].value, 
            password: 'sherry123', 
            username: profile.displayName,
            isActive: true,
            role: 'user',
          });
        }

        console.log("Inside google ");
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log("user id in serialize ", user.id);
  
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    console.log("user info after deserialize", user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
