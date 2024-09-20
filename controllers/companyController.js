const Company = require('../models/Company');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create company by Super Admin
exports.createCompany = async (req, res) => {
    try {
        const { companyName, name, email, password } = req.body;

        // Check if the user making the request is a Super Admin
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({ message: 'Access denied. Only Super Admins can create companies.' });
        }

        if (!companyName || !name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if the user with the provided email already exists
        const userExists = await User.exists({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Company with this email already exists.' });
        }

        // Create a new company
        const company = new Company({
            companyName: companyName,
            owner: req.user._id // Automatically assign the Super Admin as the owner
        });

        await company.save();

        // Create a new user with the role of company-admin
        const newAdmin = new User({
            name,
            email,
            password,
            role: 'company-admin',
            company: company._id,
        });

        await newAdmin.save();

        res.status(201).json({ company, admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Could not create company.', error: error.message });
    }
};


// Login company
exports.loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // Find the user by email
        const user = await User.findOne({ email }).populate('company');

        if (!user || user.role !== 'company-admin') {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, company: user.company });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Could not log in.', error: error.message });
    }
};

// GET all companies
exports.getAllCompanies = async (req, res) => {
    try {
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({ message: 'Access denied. Only Super Admins can view all companies.' });
        }

        const companies = await Company.find().populate('owner', 'name email');
        if (!companies) {
            return res.status(404).json({ message: 'No companies found.' });
        }

        const companiesAdmin = await User.find({ role: 'company-admin' }).populate('company', 'companyName');
        if (!companiesAdmin) {
            return res.status(404).json({ message: 'No company admins found.' });
        }

        const result = companies.map(company => {
            const admin = companiesAdmin.find(admin => admin.company._id.toString() === company._id.toString());
            return {
                company,
                admin
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error. Could not fetch companies.', error: error.message });
    }
};