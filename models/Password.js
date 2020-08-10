const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  selector: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expire: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Password', passwordSchema)