const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const ratingController = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Normal user can submit or modify rating for a store
router.post(
    '/',
    authenticateToken,
    authorizeRoles('Normal User'),
    [
        body('storeId').isUUID(),
        body('rating').isInt({ min: 1, max: 5 }),
    ],
    ratingController.submitOrUpdateRating
);

// Normal user can get their submitted ratings
router.get(
    '/my',
    authenticateToken,
    authorizeRoles('Normal User'),
    ratingController.getUserRatings
);

// Store owner can get ratings for their store
router.get(
    '/store',
    authenticateToken,
    authorizeRoles('Store Owner'),
    ratingController.getStoreRatings
);

// Test route to verify router is working
router.get(
    '/test',
    (req, res) => {
        res.json({ message: 'Ratings router is working' });
    }
);

module.exports = router;
