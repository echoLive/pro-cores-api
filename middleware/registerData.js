var validator = require('../validator');
const RES = require('../constants/response').RES

module.exports = (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.username === undefined) {
        success = 0
        message = RES.EMPTY_USERNAME
    } else if (data.username.length === 0) {
        success = 0
        message = RES.EMPTY_USERNAME
    }
    if (data.email === undefined) {
        success = 0
        message = RES.EMPTY_EMAIL
    } else if (!validator.validateEmail(data.email)) {
        success = 0
        message = RES.INVALID_EMAIL
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