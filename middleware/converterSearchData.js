const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.identifier === undefined) {
        success = 0
        message = RES.EMPTY_IDENTIFIER
    }
    if (data.make === undefined) {
        success = 0
        message = RES.EMPTY_MAKE
    } 
    if (data.model === undefined) {
        success = 0
        message = RES.EMPTY_MODEL
    } 
    if (data.activePage === undefined) {
        success = 0
        message = RES.EMPTY_ACTIVEPAGE
    } 
    if(!success) {
        return res.send({ 
            success: success,
            message: message
        });
    }
    next();
};