const mongoose = require('mongoose');

const convertRateSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true,
        default: 100
    }
});

module.exports = mongoose.model('ConvertRate', convertRateSchema);