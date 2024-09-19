const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');

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