const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data._id === undefined) {
        success = 0
        message = RES.EMPTY_ID
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