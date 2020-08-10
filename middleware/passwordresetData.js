const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.selector === undefined) {
        success = 0
        message = RES.INVALID_REQUEST
    }
    if (data.token === undefined) {
        success = 0
        message = RES.INVALID_REQUEST
    } 
    if (data.password === undefined) {
        success = 0
        message = RES.EMPTY_PASSWORD
    } else if (data.password.length < 5) {
        success = 0
        message = RES.PASSWORD_LENGTH_ERROR
    }
    if(!success) {
        return res.send({ 
            success: success,
            message: message
        });
    }
    next();
  };