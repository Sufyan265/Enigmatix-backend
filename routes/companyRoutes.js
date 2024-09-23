const express = require('express');
const { createCompany, loginCompany, } = require('../controllers/companyController');
const { protect, superAdmin, companyAdmin } = require('../middleware/authMiddleware');
const { deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/', protect, superAdmin, createCompany);
router.post('/login', loginCompany);
router.delete('/delete', protect, companyAdmin, deleteUser);

module.exports = router;