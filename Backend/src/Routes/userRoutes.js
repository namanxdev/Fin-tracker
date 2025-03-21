import express from 'express';
import auth from '../middleware/auth.js';
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
} from '../Controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("User Routes");
});

// @route   POST /api/User/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/User/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/User/logout
// @desc    Logout user
// @access  Private
router.get('/logout', auth, logoutUser);

// @route   GET /api/User/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   PUT /api/User/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateUserProfile);

export default router;