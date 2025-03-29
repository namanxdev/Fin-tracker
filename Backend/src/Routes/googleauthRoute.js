import express from 'express';
import passport from 'passport';
const router = express.Router();

// Route to initiate Google authentication
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// Google callback route
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Set token in HTTP-only cookie
    res.cookie('token', req.user.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
     // Use proper frontend URL based on environment
      const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://fintracker-3jn2.onrender.com/dashboard'
      : process.env.FRONTEND_URL + '/dashboard';
      
    res.redirect(redirectUrl);
  }
);

export default router;