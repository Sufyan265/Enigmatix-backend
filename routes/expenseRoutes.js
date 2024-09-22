const express = require('express');
const { submitExpense, approveExpense, allExpenses } = require('../controllers/expenseController');
const { protect, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/submit', protect, submitExpense);
router.get('/', protect, companyAdmin, allExpenses);
router.put('/:id/approve', protect, companyAdmin, approveExpense);

module.exports = router;
