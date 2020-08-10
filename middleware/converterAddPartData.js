const RES = require('../constants/response').RES
var validator = require('validator');

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.platinum === undefined) {
        success = 0
        message = RES.EMPTY_PLATINUM
    }
    if (!validator.isFloat(data.platinum.toString())) {
        success = 0
        message = 'Platium ' + RES.NOT_FLOAT
    }
    if (data.palladium === undefined) {
        success = 0
        message = RES.EMPTY_PALLADIUM
    }
    if (!validator.isFloat(data.palladium.toString())) {
        success = 0
        message = 'Palladium ' + RES.NOT_FLOAT
    }
    if (data.rhodium === undefined) {
        success = 0
        message = RES.EMPTY_RHODIUM
    }
    if (!validator.isFloat(data.rhodium.toString())) {
        success = 0
        message = 'Rhodium ' + RES.NOT_FLOAT
    }
    if (data.weight === undefined) {
        success = 0
        message = RES.EMPTY_WEIGHT
    }
    if (!validator.isFloat(data.weight.toString())) {
        success = 0
        message = 'Weight ' + RES.NOT_FLOAT
    }
    if (data.identifier === undefined) {
        success = 0
        message = RES.EMPTY_IDENTIFIER
    }
    if (data.price === undefined) {
        success = 0
        message = RES.EMPTY_PRICE
    } 
    if (data.make === undefined) {
        success = 0
        message = RES.EMPTY_MAKE
    } 
    if (data.model === undefined) {
        success = 0
        message = RES.EMPTY_MODEL
    } 
    if (data.year === undefined) {
        success = 0
        message = RES.EMPTY_YEAR
    } 
    if (data.notes === undefined) {
        success = 0
        message = RES.EMPTY_NOTE
    } 
    if (data.images === undefined) {
        success = 0
        message = RES.EMPTY_IMAGES
    } 
    if(!success) {
        return res.send({ 
            success: success,
            message: message
        });
    }
    next();
};