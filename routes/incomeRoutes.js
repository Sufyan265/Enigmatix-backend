const express = require('express');
const { submitIncome, companyIncomes } = require('../controllers/incomeController');
const { protect, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/submit', protect, companyAdmin, submitIncome);
router.get('/:companyId', protect, companyAdmin, companyIncomes);

module.exports = router;
