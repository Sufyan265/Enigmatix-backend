const Expense = require('../models/Expense');

// Submit Expense (User)
exports.submitExpense = async (req, res) => {
    const { description, amount, company } = req.body;
    const expense = new Expense({
        description,
        amount,
        submittedBy: req.user._id,
        company
    });

    await expense.save();
    res.status(201).json(expense);
};

// Approve Expense (Company Admin)
exports.approveExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    expense.isApproved = true;
    expense.approvedBy = req.user._id;
    await expense.save();

    res.json(expense);
};
