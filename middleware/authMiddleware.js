const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decoded.id, decoded.userId);

            // Get user from the token
            if (decoded.id) {
                req.user = await User.findById(decoded.id).select('-password');
            } else if (decoded.userId) {
                req.user = await User.findById(decoded.userId);
            }
            // req.user = await User.findById(decoded.id).select('-password');


            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

exports.superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'super-admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only Super Admins can perform this action.' });
    }
};

exports.companyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'company-admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only Company Admins can perform this action.' });
    }
};