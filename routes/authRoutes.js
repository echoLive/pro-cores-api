const express = require('express');
const passport = require('passport');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const User = require('../models/User');
const Password = require('../models/Password');
const registerData = require('../middleware/registerData');
const passwordresetrequestData = require('../middleware/passwordresetrequestData');
const passwordresetData = require('../middleware/passwordresetData');
const profileupdateData = require('../middleware/profileupdateData');
const getAllUsersData = require('../middleware/getAllUsersData');
const revokeAndgrantDate = require('../middleware/revokeAndgrantDate');
const passwordprofileupdateData = require('../middleware/passwordprofileupdateData');
const loginData = require('../middleware/loginData');
const requireLogin = require('../middleware/requireLogin');
const EmailServer = require('../service/email');
const router = express.Router();
const RES = require('../constants/response').RES


router.post('/grant_user', /* requireLogin, */ revokeAndgrantDate, async (req, res) => {
  /*-
  const user = req.user
  if (user.status !== 'active') {
    res.send({
      success: 0,
      message: RES.INACTIVATED_REQUEST
    })
    return
  }
  */
  const data = req.body
  User.findOne({ _id: data.id }, async (err, user) => {
    if (err) {
      res.send({
        success: 0, 
        message: err 
      });
      return
    } 
    if (!user) {
      res.send({ 
        success: 0, 
        message: RES.USER_NOT_FOUND
      });
      return
    }
    if (user.user_type != 'admin') {
      res.send({ 
        success: 0, 
        message: RES.SERVER_ERROR
      });
      return
    }
    await User.findOneAndUpdate({_id: data.user_id}, {
      status: 'active',
      }, {upsert: true}, function(err, doc) {
        
        const url = EmailServer.Domain_Url + 'login';
        let message='<p>Your access to the platform has been renewed. Please login by clicking a link below.<br/><a href="'+url+'">'+'Login'+'</a></p>';
        var mailOptions = {
          from: EmailServer.Company_Email,
          to: doc.email,
          subject: 'Grant Account',
          html: message
        };
        EmailServer.transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log('error', error)
          }
        })
    });
    res.send({
      success: 1, 
      message: RES.UPDATE_SUCCESS
    });
  })
})

router.post('/revoke_user', /* requireLogin, */ revokeAndgrantDate, async (req, res) => {
  /*-
  const user = req.user
  if (user.status !== 'active') {
    res.send({
      success: 0,
      message: RES.INACTIVATED_REQUEST
    })
    return
  }
  */
  const data = req.body
  User.findOne({ _id: data.id }, async (err, user) => {
    if (err) {
      res.send({
        success: 0, 
        message: err 
      });
      return
    } 
    if (!user) {
      res.send({ 
        success: 0, 
        message: RES.USER_NOT_FOUND
      });
      return
    }
    if (user.user_type != 'admin') {
      res.send({ 
        success: 0, 
        message: RES.SERVER_ERROR
      });
      return
    }
    await User.findOneAndUpdate({_id: data.user_id}, {
      status: 'inactive',
      }, {upsert: true}, function(err, doc) {
        var mailOptions = {
          from: EmailServer.Company_Email,
          to: doc.email,
          subject: 'Access Expired',
          html: 'Your access to the platform has expired.'
        };
        EmailServer.transporter.sendMail(mailOptions, function(error, info){})
    });
    res.send({
      success: 1, 
      message: RES.UPDATE_SUCCESS
    });
  })
})

router.post('/get_all_users', /* requireLogin, */ getAllUsersData, async (req, res) => {
  /*-
  const user = req.user
  if (user.status !== 'active') {
    res.send({
      success: 0,
      message: RES.INACTIVATED_REQUEST
    })
    return
  }
  */
  const data = req.body
  User.findOne({ _id: data.id }, async (err, user) => {
    if (err) {
      res.send({ 
        success: 0, 
        message: err 
      });
      return
    } 
    if (!user) {
      res.send({ 
        success: 0, 
        message: RES.USER_NOT_FOUND
      });
      return
    }
    if (user.user_type != 'admin') {
      res.send({ 
        success: 0, 
        message: RES.SERVER_ERROR
      });
      return
    }
    const users = await  User.find({})
    res.send({ 
      success: 1, 
      data: users
    });
  })
})

router.post('/change_usernameemail', /* requireLogin, */ profileupdateData, async (req, res) => {
  /*-
  const user = req.user
  if (user.status !== 'active') {
    res.send({
      success: 0,
      message: RES.INACTIVATED_REQUEST
    })
    return
  }
  */
  const data = req.body
  User.updateOne({_id: data.id}, {
    full_name: data.name,
    email: data.email,
  }, async function(err, affected, resp) {
    if (err) {
      res.send({
        success: 0,
        message: RES.SERVER_ERROR
      })
    }
    else {
      const user = await User.findOne({ '_id': data.id})
      res.send({
        success: 1,
        message: RES.UPDATE_SUCCESS,
        user: user
      })
    }
  })
})

router.post('/profile_update', requireLogin, profileupdateData, async (req, res) => {
  const data = req.body
  const user = await req.user
  req.body.password = user.password
  User.updateOne({_id: user.id}, {
    full_name: data.name,
    email: data.email,
  }, function(err, affected, resp) {
    if (err) {
      res.send({
        success: 0,
        message: RES.SERVER_ERROR
      })
    }
    else {
      res.send({
        success: 1,
        message: RES.UPDATE_SUCCESS
      })
    }
  })
})

router.post('/password_profile_update', /* requireLogin, */ passwordprofileupdateData, async (req, res) => {
  /*-
  const user = req.user
  if (user.status !== 'active') {
    res.send({
      success: 0,
      message: RES.INACTIVATED_REQUEST
    })
    return
  }
  */
  const data = req.body
  User.findOne({ _id: data.id },(err, user) => {
    if (err) {
      res.send({ 
        success: 0, 
        message: err 
      });
      return
    } 
    if (!user) {
      res.send({ 
        success: 0, 
        message: RES.USER_NOT_FOUND
      });
      return
    }
    user.changePassword(data.o_password, data.n_password, function(err) {
      if (err) {
        if (err.name === 'IncorrectPasswordError'){
          res.send({ 
            success: 0, 
            message: RES.WRONG_OLD_PASSWORD
          });
        } else {
          res.send({
            success: 0, 
            message: RES.SERVER_ERROR
          });
        }
      } else {
        res.send({ 
          success: 1, 
          message: RES.UPDATE_SUCCESS
        });
      }
    })
  })
})

router.post('/password_reset', passwordresetData, (req, res) => {
  const selector = req.body.selector
  const token = req.body.token
  Password.find({ 'selector': selector}, async (err,data)=>{
    if(err) {
      res.send({
        success: 0,
        message: RES.SERVER_ERROR
      })
      return
    }
    if (data.length === 0) {
      res.send({
        success: 0,
        message: RES.INVALID_REQUEST
      })
      return
    }
    if (data[0]['token'] != token) {
      res.send({
        success: 0,
        message: RES.INVALID_REQUEST
      })
      return
    }
    let expire = new Date();
    if (expire.getTime() > new Date(data[0]['expire']).getTime()) {
      res.send({
        success: 0,
        message: RES.TOKEN_EXPIRE
      })
      return
    }
    User.findByUsername(data[0]['email']).then(function(sanitizedUser){
      if (sanitizedUser) {
        sanitizedUser.setPassword(req.body.password, async function(){
          await sanitizedUser.save();
          await Password.find({ email: data[0]['email'] }).deleteMany().exec();
          res.send ({
            success: 1,
            message: RES.UPDATE_SUCCESS
          })
        });
      } else {
        res.send ({
          success: 0,
          message: RES.SERVER_ERROR
        })
      }
    },function(err){
      res.send ({
        success: 0,
        message: RES.SERVER_ERROR
      })
    })
  })
})

router.post('/password_reset_request', passwordresetrequestData, async (req, res) => {
  
  const selector = await uuidv1()
  const token = await uuidv4()
  let expire = await new Date();
  expire.setMinutes( expire.getMinutes() + 6 * 60 );
  
  await Password.find({ email: req.body.email }).deleteMany().exec();

  var newPassword = new Password();
  newPassword.email = req.body.email,
  newPassword.selector = selector,
  newPassword.token = token,
  newPassword.expire = expire,
  newPassword.save(function(err, data) {
    if (err) {
      res.send({
        success: 0,
        message: RES.SERVER_ERROR
      })
      return
    }
    const url = EmailServer.Domain_Url + 'password_reset?selector='+selector+'&validator='+token;
    let message='<p>We received a password request. The link to reset your password is below. If you did not make this request, you can ignore this email</p>';
    message +="<p>Here is your password reset link:</br></p>";
    message += '<a href="'+url+'">'+'Reset Here'+'</a></p>';
    var mailOptions = {
      from: EmailServer.Company_Email,
      to: req.body.email,
      subject: 'Reset your password for wozjobsteam.',
      html: message
    };
    EmailServer.transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('error', error)
        res.send({
          success: 0,
          message: RES.SERVER_ERROR
        })
      } else {
        res.send({
          success: 1,
          message: RES.PASSWORD_RESET_EMAIL
        })
      }
    });
  })
})

router.post('/register', registerData, (req, res) => {

  const data = req.body
  const newUser = {
    full_name: data.username,
    email: data.email,
  };
                             
  User.register(newUser, data.password, (err, user) => {
    if (err) {
      if (err.name === 'UserExistsError') {
        res.send({
          success: 0,
          message: RES.USED_EMAIL
        })
      } else {
        res.send({
          success: 0,
          message: RES.SERVER_ERROR
        })
      }
    } else {
      passport.authenticate('local')(req, res, () => 
        res.send({
          success: 1,
          message: RES.SUCCESS_REGISTER,
          user: req.user
        })
      );
    }
  });
});


router.post('/login', loginData, function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send({
      success: 0,
      message: RES.INVALID_COMBINATION
    }) }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if (user.status === 'inactive') {
        return res.send({
          success: 0,
          message: RES.ACCESS_REVOKE
        })
      } else {
        return res.send({
          success: 1,
          message: RES.SUCCESS_LOGIN,
          user: user
        })
      }
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send({
    success: 1,
    message: RES.SUCCESS_LOGOUT
  });
}); 

router.get('/check_session', requireLogin, (req, res) => {
  res.send({
    success: 1,
    message: 'logged In'
  })
});

module.exports = router;