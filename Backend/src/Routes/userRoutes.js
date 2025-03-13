import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import auth from '../middleware/auth.js';
import {ExpressError} from '../middleware/ErrorHandler.js';

const router = express.Router();


router.get('/', (req, res,next) => {
    res.send("User Routes");
})
// @route   POST /api/User/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res,next) => {
    try {
        const { name, email, password } = req.body;
        if(password.length<6){
            throw new ExpressError('Password must be at least 6 characters', 400);
        }
        
        if(!name || !email || !password){
            throw new ExpressError('Please fill all the fields', 400);
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        
            throw new ExpressError('User already exists', 400);
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({
        name,
        email,
        password: hashedPassword
        });
        
        await user.save();
        
        // Generate JWT
        const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
        });
    } catch (error) {
        console.log(error.message +'error in register');
        next(error);
    }
});

// @route   POST /api/User/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res,next) => {
    try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new ExpressError('Invalid credentials', 400);
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ExpressError('Invalid credentials', 400);
    }
    
    // Generate JWT
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    //set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
    } catch (error) {
        console.error(error+'error in login');
        next(error);
    }
});
// @route   GET /api/User/logout
// @desc    Logout user
// @access  Private
router.get('/logout', auth, async (req, res,next) => {
    try {
        // Invalidate the token by removing it from the client side
        res.clearCookie('token')
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error+'error in logout');
        next(error);
    }
})


// @route   GET /api/User/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res,next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            throw new ExpressError('User not found', 404);
        }
        res.json(user);
    } catch (error) {
        console.error(error+'Server error userRoutes::profile');
        next(error);
    }
});

// @route   PUT /api/User/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res,next) => {
    try {
        const { name, email, password } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        
        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        });
        } else {
        throw new ExpressError('User not found', 404);
        }
    } catch (error) {
        console.error(error+'Server error userRoutes::update profile');
        next(error);
    }
});

export default router;