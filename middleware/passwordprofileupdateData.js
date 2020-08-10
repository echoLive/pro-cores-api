const RES = require('../constants/response').RES

module.exports = async (req, res, next) => {
    let success = 1
    let message = ''
    const data = req.body
    if (data.id === undefined) {
        success = 0
        message = RES.EMPTY_ID
    }
    if (data.o_password === undefined) {
        success = 0
        message = RES.EMPTY_OLDPASSWORD
    } else if (data.o_password.length < 5) {
        success = 0
        message = RES.OLDPASSWORD_LENGTH_ERROR
    }
    if (data.n_password === undefined) {
        success = 0
        message = RES.EMPTY_NEWPASSWORD
    } else if (data.n_password.length < 5) {
        success = 0
        message = RES.NEWPASSWORD_LENGTH_ERROR
    }
    if(!success) {
        return res.send({ 
            success: success,
            message: message
        });
    }
    next();
};