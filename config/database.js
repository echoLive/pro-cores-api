const mongoose = require('mongoose');
const privates = require('./privates');

mongoose.connect(privates.mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Verify connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
.once('open', () => console.log("MongoDB instance is running"));

module.exports = { mongoose };
