const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    price: {
        type: Number
    },
    commodity_type: {
        type: String, 
        enum: ['pd', 'pt', 'rh'], 
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
});

module.exports = mongoose.model('Pricing', pricingSchema);