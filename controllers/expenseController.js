const Expense = require('../models/Expense');
const Company = require('../models/Company');
const mongoose = require('mongoose');

// Submit Expense (User)
exports.submitExpense = async (req, res) => {
    try {
        const { amount, companyId } = req.body;

        if (!amount || !companyId) {
            return res.status(400).json({ message: 'Please provide  amount and companyId' });
        }

        // Check if companyId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID.' });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }


        const expense = new Expense({
            amount,
            submittedBy: req.user._id,
            companyId
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch All Expenses (Admin)
exports.companyExpenses = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Check if companyId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID.' });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Fetch all expenses
        const expenses = await Expense.find({ companyId })
            .populate('submittedBy', 'name email') // Populating user info
            .populate('approvedBy', 'name email')  // Populating approver info if available
            .populate('companyId', 'name');       // Populating company info

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Approve Expense (Company Admin)
exports.approveExpense = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)

        // Validate the expense ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid expense ID.' });
        }

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        expense.isApproved = true;
        expense.approvedBy = req.user._id;
        await expense.save();

        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};