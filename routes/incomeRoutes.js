const express = require('express');
const { submitIncome, allIncomes } = require('../controllers/incomeController');
const { protect, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/submit', protect, companyAdmin, submitIncome);
router.get('/', protect, companyAdmin, allIncomes);

module.exports = router;
