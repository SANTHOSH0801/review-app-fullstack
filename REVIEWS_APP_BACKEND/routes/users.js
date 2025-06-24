const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const db = require('../models');
const User = db.User;
const Role = db.Role;
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Endpoint to get current logged-in user's role and info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Role }],
            attributes: ['id', 'name', 'email'],
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.Role ? user.Role.name : null,
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// User registration route
router.post('/register', authController.signup);

const { body } = require('express-validator');

// Add user route for admin with validation
router.post(
    '/',
    authenticateToken,
    [
        body('name').isLength({ min: 8, max: 60 }),
        body('email').isEmail(),
        body('address').isLength({ max: 400 }),
        body('password')
            .isLength({ min: 8, max: 16 })
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[^A-Za-z0-9]/)
            .withMessage('Password must contain at least one special character'),
        body('role').isIn(['Normal User', 'System Administrator', 'Store Owner']),
        body('storeName').if(body('role').equals('Store Owner')).notEmpty().withMessage('Store Name is required for Store Owner'),
    ],
    userController.addUser
);

module.exports = router;
