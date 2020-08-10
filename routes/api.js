const express = require('express');
const app = express()
const Pricing = require('../models/Pricing');
const User = require('../models/User');
const Converter = require('../models/Converter');
const requireLogin = require('../middleware/requireLogin');

app.get('/converters', (req, res) => {
  Converter.find({identifier: {'$regex': req.query.search, '$options': 'i'}}).exec((err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({
      status: 'success',
      data: result
    })
  })
})

module.exports = app;
