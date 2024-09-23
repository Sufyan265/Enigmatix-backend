const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

// Create User (Company Admin only)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, companyId } = req.body;

        if (!name || !email || !password || !companyId) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if companyId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID.' });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Check if the user with the provided email already exists
        const userExists = await User.exists({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: 'user',
            company: company._id,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users for a specific company (Company Admin)
exports.getUsersByCompany = async (req, res) => {
    try {
        const users = await User.find({ company: req.user.company });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1y' });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete user by Admin
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user by id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Delete all incomes associated with the user
        await Expense.deleteMany({ submittedBy: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Could not delete user.', error: error.message });
    }
};