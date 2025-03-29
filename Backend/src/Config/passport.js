import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../Models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const setupPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists by Google ID
          let user = await User.findOne({ googleId: profile.id });
          
          // If no user found with Google ID, check email
          if (!user && profile.emails?.length) {
            user = await User.findOne({ email: profile.emails[0].value });
            
            // If user exists with this email, link Google account
            if (user) {
              user.googleId = profile.id;
              user.isVerified = true;
              await user.save();
            } 
            // Create new user if not exist - FIX THE FIELDS HERE
            else {
              // Generate a random password for Google users
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(
                Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4),
                salt
              );
              
              user = await User.create({
                // Use name instead of username to match your model
                name: profile.displayName || profile.emails[0].value.split('@')[0],
                email: profile.emails[0].value,
                googleId: profile.id,
                // Add a proper password to satisfy validation
                password: hashedPassword,
                isVerified: true
              });
            }
          }
          
          // Create JWT token
          const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
          );
          
          // Return user and token
          return done(null, { user, token });
        } catch (error) {
          console.error("Google Auth Error:", error);
          return done(error, null);
        }
      }
    )
  );
};

export default setupPassport;