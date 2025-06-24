const express = require('express');
const router = express.Router();
const storeOwnerAuthController = require('../controllers/storeOwnerAuthController');

router.post('/registerWithStore', storeOwnerAuthController.signupWithStore);

module.exports = router;
