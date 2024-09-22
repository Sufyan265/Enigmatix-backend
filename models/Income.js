const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
