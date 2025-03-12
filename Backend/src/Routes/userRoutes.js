import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/User/register
// @desc    Register a new user
// @access  Public
router.get('/', (req, res) => {
    res.send("User Routes");
})

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
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
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '30d' }
        );
        
        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error userRoutes::register' });
    }
});

// @route   POST /api/User/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
    );
    
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error userRoutes::login' });
    }
});

// @route   GET /api/User/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error userRoutes::profile' });
    }
});

// @route   PUT /api/User/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
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
        res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;