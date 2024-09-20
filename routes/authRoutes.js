const express = require('express');
const { login } = require('../controllers/authController');
const { protect, superAdmin } = require('../middleware/authMiddleware');
const { getAllCompanies } = require('../controllers/companyController');
const router = express.Router();

router.post('/login', login);
router.get('/allCompanies', protect, superAdmin, getAllCompanies);

module.exports = router;
