const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get(
    '/dashboard',
    authenticateToken,
    authorizeRoles('System Administrator'),
    adminController.getDashboardStats
);

const userController = require('../controllers/userController');

router.get(
    '/users',
    authenticateToken,
    authorizeRoles('System Administrator'),
    userController.getUsers
);

module.exports = router;
