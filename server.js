const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const converterRoutes = require('./routes/converterRoutes');
const api = require('./routes/api')
const User = require('./models/User');
const privates = require('./config/privates');


const port = process.env.PORT || 5000;

const db = require('./config/database')
const Agenda = require('./price_cron/cron').Agenda

const app = express();

// const convertersProducts = require('./seeds/converters');
// convertersProducts();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use( bodyParser.json({limit: '50mb'}) );
app.use(urlencodedParser);
app.use(expressSession({
  secret: privates.sessionSecret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email',
  usernameQueryFields: ['email']
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cors())
app.use('/auth', authRoutes);
app.use('/converter', converterRoutes);
app.use('/api', api)
app.listen(port, () => console.log('SERVER NOW RUNNING...'));

module.exports = app;
