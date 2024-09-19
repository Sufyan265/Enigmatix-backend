const express = require('express');
const { submitExpense, approveExpense } = require('../controllers/expenseController');
const { protect, companyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, submitExpense);
router.put('/:id/approve', protect, companyAdmin, approveExpense);

module.exports = router;
