const express = require('express');
const { createCompany, loginCompany } = require('../controllers/companyController');
const { protect, superAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, superAdmin, createCompany);
router.post('/login', loginCompany);

module.exports = router;