const express = require('express');
const {  createUser, getUsersByCompany, getUserById, loginUser } = require('../controllers/userController');
const { protect, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
router.post('/', protect, companyAdmin, createUser); // Company Admin creates User
router.get('/', protect, companyAdmin, getUsersByCompany); // Get users by company
router.get('/:id', protect, getUserById); // Get single user by ID
router.post('/login', loginUser); // Login user

module.exports = router; 