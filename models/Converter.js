const mongoose = require('mongoose');

const converterSchema = new mongoose.Schema({
    identifier: {
        type: String
    },
    images: [
        {
            type: String
        }
    ],
    make: {
        type: String
    },
    model: {
        type: String
    },
    year: {
        type: Number
    },
    platinum: {
        type: Number, 
        default: 0
    },
    palladium: {
        type: Number, 
        default: 0
    },
    rhodium: {
        type: Number, 
        default: 0
    },
    weight: {
        type: Number, 
        default: 0
    },
    converter_price: {
        type: Number, 
        default: 0, 
        required: true
    },
    converter_price_last_updated: {
        type: Date, 
        required: true, 
        default: Date.now
    },
    price: {
        type: Number
    },
    notes: {
        type: String
    },
    status: {
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active', 
        required: true
    },
    created_on: {
        type: Date, 
        required: true, 
        default: Date.now
    }
});

module.exports = mongoose.model('Converter', converterSchema);