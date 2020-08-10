const RES = require('../constants/response').RES

module.exports = (req, res, next) => {
  if(!req.user) {
    return res.send({ 
      success: 0,
      message: RES.MUST_LOGIN
    });
  }
  next();
};