const express = require('express');
const { login } = require('../controllers/authController');
const { protect, superAdmin } = require('../middleware/authMiddleware');
const { getAllCompanies, getReport, deleteCompany } = require('../controllers/companyController');
const router = express.Router();

router.post('/login', login);
router.get('/allCompanies', protect, superAdmin, getAllCompanies);
router.delete('/delete', protect, superAdmin, deleteCompany);
router.get('/report', protect, superAdmin, getReport);

module.exports = router;
