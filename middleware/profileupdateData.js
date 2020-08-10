const User = require('../models/User');
var validator = require('../validator');
const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    
    if (data.id === undefined) {
        success = 0
        message = RES.EMPTY_ID
    }

    if (data.name === undefined) {
        success = 0
        message = RES.EMPTY_USERNAME
    } else if (data.name.length === 0) {
        success = 0
        message = RES.EMPTY_USERNAME
    }

    if (data.email === undefined) {
        success = 0
        message = RES.EMPTY_USERNAME
    } else if (!validator.validateEmail(data.email)) {
        success = 0
        message = RES.INVALID_EMAIL
    } else {
        const finduser = await User.findOne({ 'email': data.email})
        const presentuser = await req.user
        if (presentuser !== undefined && finduser !== null && presentuser._id.toString() != finduser._id.toString()) {
            success = 0
            message = RES.USED_EMAIL
        }
    }

    if(!success) {
        return res.send({ 
            success: success,
            message: message
        });
    }
    next();
}