const express = require('express');
const { submitExpense, approveExpense, companyExpenses } = require('../controllers/expenseController');
const { protect, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/submit', protect, submitExpense);
router.get('/:companyId', protect, companyAdmin, companyExpenses);
router.put('/:id/approve', protect, companyAdmin, approveExpense);

module.exports = router;
