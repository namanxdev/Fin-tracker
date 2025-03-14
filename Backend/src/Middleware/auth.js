import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {ExpressError} from '../utils/ErrorHandler.js';

/**
 * Authentication middleware
 * Verifies the JWT token in the request header and attaches the user to the request object
 */
    const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.cookies.token
        
        // Check if no token
        if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
        }
        
        try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            // return res.status(401).json({ message: 'User not found' });
            throw new ExpressError('User not found', 404);
        }
        
        // Set user on request object
        req.user = user;
        req.user.id = user._id; // Ensure id is available
        
        next();
        } catch (err) {
        // Token is not valid
        res.status(401).json({ message: 'Token is not valid' });
        }
    } catch (error) {
        // console.error('Auth middleware error:', error);
        // res.status(500).json({ message: 'Server error' });
        // Pass the error to the next middleware
        console.error('Auth middleware error:', error);
        next(error);
    }
};

export default auth;