const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// Signup route for normal users
router.post(
  '/signup',
  [
    body('name').isLength({ min: 8, max: 60 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('password')
      .isLength({ min: 8, max: 16 })
      .matches(/[A-Z]/)
      .matches(/[^A-Za-z0-9]/),
  ],
  authController.signup
);

// Login route for all users
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists(),
  ],
  authController.login
);

// Update password route
router.put(
  '/update-password',
  [
    body('email').isEmail(),
    body('oldPassword').exists(),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .matches(/[A-Z]/)
      .matches(/[^A-Za-z0-9]/),
  ],
  authController.updatePassword
);

module.exports = router;
