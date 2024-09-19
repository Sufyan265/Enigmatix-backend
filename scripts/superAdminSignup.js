const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const dbConnect = require('../config/db');

dotenv.config();
dbConnect();

const createSuperAdmin = async () => {
    try {
        const superAdmin = new User({
            name: 'Super Admin',
            email: 'superadmin@gmail.com', // Change this email
            password: 'superAdmin123', // Change this password
            role: 'super-admin',
        });

        await superAdmin.save();
        console.log('Super Admin account created successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        mongoose.connection.close();
    }
};

createSuperAdmin();
