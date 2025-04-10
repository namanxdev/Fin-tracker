import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';
import { ExpressError } from '../utils/ErrorHandler.js';

// @desc    Register a new user
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
        throw new ExpressError('Please fill all the fields', 400);
        }
        
        if (password.length < 6) {
        throw new ExpressError('Password must be at least 6 characters', 400);
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
        console.log(error.message + ' - error in register');
        next(error);
    }
};

// @desc    Authenticate user & get token
// @access  Public
export const loginUser = async (req, res, next) => {
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
        
        // Set the token in a cookie
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
        console.error(error + ' - error in login');
        next(error);
    }
};

// @desc    Logout user
// @access  Private
export const logoutUser = async (req, res, next) => {
    try {
        // Invalidate the token by removing it from the client side
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error + ' - error in logout');
        next(error);
    }
};

// @desc    Get user profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
        throw new ExpressError('User not found', 404);
        }
        res.json(user);
    } catch (error) {
        console.error(error + ' - Server error in getUserProfile');
        next(error);
    }
};

// @desc    Update user profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
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
        console.error(error + ' - Server error in updateUserProfile');
        next(error);
    }
};
// @desc    Verify user password
// @access  Private


export const verifyPassword = async (req, res) => {
        try {
        const { password } = req.body;
        
        // Since auth middleware excludes password, we need to query it again
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }
        } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ success: false, message: 'Server error' });
        }
};

// @desc    Change user password
// @access  Private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            throw new ExpressError('Please provide both current and new password', 400);
        }
        
        // Find user with password field included
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            throw new ExpressError('User not found', 404);
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new ExpressError('Current password is incorrect', 401);
        }
        
        // Ensure new password is different
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new ExpressError('New password cannot be the same as your current password', 400);
        }
        
        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        
        res.status(200).json({ 
            success: true,
            message: 'Password updated successfully' 
        });
    } catch (error) {
        console.error('Error changing password:', error);
        next(error);
    }
};