const express = require('express');
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const uploadMiddleware = require('../middleware/uploadMiddleware.js');

const router = express.Router();

router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.put('/profile/:id', authMiddleware, uploadMiddleware.single('photo'), userController.updateProfile);
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.get('/profiles', authMiddleware, userController.getAllProfiles);

module.exports = router;
