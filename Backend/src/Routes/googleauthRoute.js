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
      // secure: process.env.NODE_ENV === 'production',
    });
    
    // Redirect to frontend
    res.redirect(process.env.FRONTEND_URL + '/dashboard');
  }
);

export default router;