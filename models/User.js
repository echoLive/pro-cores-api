const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  user_type: {
    type: String, 
    required: true, 
    enum: ['user', 'admin'], 
    default: 'user'
  },
  full_name: {
    type: String
  },
  email: {
    type: String, 
    required: true, 
    unique: true, 
    dropDups: true
  },
  // token: {
  //   type: String,
  //   required: true
  // },
  password: {
    type: String,
  },
  status: {
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active', 
    required: true
  },
  created_on: {
    type: Date, 
    default: Date.now,
    required: true,
  }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });
module.exports = mongoose.model('User', userSchema);