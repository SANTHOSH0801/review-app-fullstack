const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const storeController = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Admin can add new stores
router.post(
    '/',
    authenticateToken,
    authorizeRoles('System Administrator'),
    [
        body('storeName').isLength({ min: 20, max: 60 }),
        body('ownerName').isLength({ min: 6, max: 60 }),
        body('email').isEmail(),
        body('address').isLength({ max: 400 }),
        body('password')
            .isLength({ min: 6, max: 100 })
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[^A-Za-z0-9]/)
            .withMessage('Password must contain at least one special character'),
        // Removed ownerId validation as frontend does not send it
    ],
    storeController.addStore
);

// Admin can get list of stores with filters
router.get(
    '/',
    authenticateToken,
    authorizeRoles('System Administrator', 'Normal User'),
    [
        query('name').optional().isString(),
        query('address').optional().isString(),
    ],
    storeController.getStores
);

/*
IMPORTANT:
The route '/owner' must be defined before '/:id' to avoid route conflicts.
Express matches routes in order, so '/owner' can be mistakenly matched as '/:id' with id='owner'.
If you experience 403 errors for '/owner', ensure this route is placed above '/:id'.
*/
router.get(
    '/owner',
    authenticateToken,
    authorizeRoles('Store Owner'),
    storeController.getStoreByOwner
);

// Get store details by ID (including average rating)
router.get(
    '/:id',
    authenticateToken,
    authorizeRoles('System Administrator', 'Normal User'),
    storeController.getStoreById
);

// Get current user's rating for a store
router.get(
    '/:id/user-rating',
    authenticateToken,
    authorizeRoles('System Administrator', 'Normal User'),
    storeController.getUserRating
);

// Submit or update user's rating for a store
router.post(
    '/:id/rate',
    authenticateToken,
    authorizeRoles('System Administrator', 'Normal User'),
    [
        body('rating').isInt({ min: 1, max: 5 }),
    ],
    storeController.submitRating
);

module.exports = router;
