var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var Domain_Url = 'http://3.93.238.220:3000/'
var Company_Email = 'cutthecatoff@mail.com'

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'cutthecatoff@mail.com',
      pass: 'smallforeign'
    },
    tls: {
        rejectUnauthorized: false
    },
    pool: true
}));

module.exports = {
    Domain_Url: Domain_Url,
    Company_Email: Company_Email,
    transporter: transporter
}
