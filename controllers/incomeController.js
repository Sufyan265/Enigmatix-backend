const Income = require('../models/Income');
const Company = require('../models/Company');
const mongoose = require('mongoose');

// Submit Income (User)
exports.submitIncome = async (req, res) => {
    try {
        const { amount, companyId } = req.body;

        if (!amount || !companyId) {
            return res.status(400).json({ message: 'Please provide amount and companyId' });
        }

        // Check if companyId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID.' });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const income = new Income({
            amount,
            companyId
        });

        await income.save();
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch Incomes for a Specific Company (Admin)
exports.companyIncomes = async (req, res) => {
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

        // Fetch all incomes for the specific company
        const incomes = await Income.find({ companyId })
            .populate('companyId', 'name');       // Populating company info

        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};