const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.id === undefined) {
        success = 0
        message = RES.EMPTY_ID
    }
    if(!success) {
        return res.send({ 
            success: success,
            message: message
        });
    }
    next();
};