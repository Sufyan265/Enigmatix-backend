const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
