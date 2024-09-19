const express = require('express');
const { createCompanyAdmin, createUser, getUsersByCompany, getUserById } = require('../controllers/userController');
const { protect, superAdmin, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
// router.post('/company-admin', protect, superAdmin, createCompanyAdmin); // Super Admin creates Company Admin
router.post('/', protect, companyAdmin, createUser); // Company Admin creates User
router.get('/', protect, companyAdmin, getUsersByCompany); // Get users by company
router.get('/:id', protect, getUserById); // Get single user by ID

module.exports = router;