const User = require('../models/User');
var validator = require('../validator');
const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.email === undefined) {
        success = 0
        message = RES.EMPTY_EMAIL
    } else if (!validator.validateEmail(data.email)) {
        success = 0
        message = RES.INVALID_EMAIL
    } else {
        const users = await User.findOne({ 'email': req.body.email})
        if (users === null) {
            success = 0
            message = RES.EMAIL_EXIST_ERROR
        }
    }
    if(!success) {
        return res.send({
            success: success,
            message: message
        });
    }
    next();
  };