const Agenda = require('agenda');
const axios = require('axios');
var validator = require('validator');
const privates = require('../config/privates');
const EmailServer = require('../service/email');
const PriceServer = require('../service/price');
const Pricing = require('../models/Pricing');
const User = require('../models/User');
const Converter = require('../models/Converter');
const {mongoose}  = require('../config/database');
const request = require('request');
const cheerio = require('cheerio');
var cron = require('node-cron');
const express = require("express");
// const fs = require("fs");
const metalsdaily_url = 'https://www.metalsdaily.com/__dta/pd.ashx';
// const getPageContent = require('../utility/scraper');

// app = express();

const agenda = new Agenda({mongo: mongoose.connection });
const cron_api_key = 'Rdbkdgt4ojm4K4y9ZXJZ';
// const cron_url_plat = `https://www.quandl.com/api/v3/datasets/JOHNMATT/PLAT?api_key=${cron_api_key}`;
// const cron_url_pall = `https://www.quandl.com/api/v3/datasets/JOHNMATT/PALL?api_key=${cron_api_key}`;
// const cron_url_rhod = `https://www.quandl.com/api/v3/datasets/JOHNMATT/RHOD?api_key=${cron_api_key}`;
const cron_error_email = 'bestway1993@protonmail.com'; //'vadim.lidich@gmail.com';


// test scraper

async function Update_Price(p_type, p_date, p_price) {
  const myquery = { commodity_type: p_type };
  const newvalues = { commodity_type: p_type, date: p_date, price: p_price }
  Pricing.findOneAndUpdate(myquery, newvalues, { upsert: true }, function(err, doc) {
    if (err) {
      console.log('error', err)
    }
  });
}

const getPageContent = ( url ) => {
  var options = {
      url: url,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'cookie': '__SP4_Shrt=; cookie_consent_performance=1; _ga=GA1.2.1822047097.1596680346;'
      },
      form: {
          com: 'XPTUSD|XPDUSD|RHOUSD'
      },
      timeout: 3000
  };

  request.post(options, function(error, response, body) {
      if(!error) {
          //console.log(body);

          const data = JSON.parse(body);
          const prices = data.p;
          var currentDate = new Date();
          var XPTUSD = 0;
          var XPDUSD = 0;
          var RHOUSD = 0;

          prices.forEach(price => {
              if(price.a == 'XPTUSD') {
                  console.log("Platinum: " + price.c);
                  XPTUSD = price.c;
              } else if(price.a == 'XPDUSD') {
                  console.log("Palladium: " + price.c);
                  XPDUSD = price.c;
              } else if(price.a == 'RHOUSD') {
                  console.log("RH: " + price.c);
                  RHOUSD = price.c;
              }
          });

          var currentDate = new Date();

            Update_Price('pt', currentDate, XPTUSD);
            Update_Price('pd', currentDate, XPDUSD);
            Update_Price('rh', currentDate, RHOUSD);
      }
  });
};

cron.schedule('*/5 * * * *', () => {
  console.log('running a node-scraper every 5 mins');
  var cDate = new Date();
  console.log(cDate);
  getPageContent(metalsdaily_url);
});
getPageContent(metalsdaily_url);


// agenda.on('ready', async function(){
//   console.log("ready");
//   await agenda.start();
//   await agenda.every('* * * * *', 'every day minute cron');
//   // agenda.every('20 seconds', 'every day price cron')
// });

// agenda.on('error', function(){
// });

// agenda.on('start', job => {
//   console.log("cron start");
// });

// agenda.on('complete', job => {
//   console.log("cron complete");
// });



// async function Error_Message(p_url, p_message) {
//   console.log('Error_Message');
//   agenda.now(
//     'send email report',
//     {
//       email_to: cron_error_email,
//       error_message: p_message,
//       request_url: p_url
//     }
//   );
// }

// agenda.define('every day price cron', {priority: 'high', concurrency: 1}, async job => {

//   // console.log('price cron start');
//   // getPageContent(metalsdaily_url);

//   // var myCDate = new Date();
//   // console.log(myCDate);

//   /*axios.get(cron_url_plat)
//   .then((res) => {
//     const start = res.data.indexOf(`"dataset":`)
//     const end = res.data.indexOf(`</code>`)
//     if (start != -1 && end !== -1) {
//       const JSON_DATA = JSON.parse(res.data.substring(start + 10, end-1))
//       Update_Price('pt', JSON_DATA.data[0][0], JSON_DATA.data[0][4])
//     }
//   }).catch((error) => {
//     const JSON_DATA = error.response.data
//     if (JSON_DATA['quandl_error'] !== undefined) {
//       Error_Message(cron_url_plat, JSON_DATA['quandl_error']['message'])
//     }
//   })

//   axios.get(cron_url_pall)
//   .then((res) => {
//     const start = res.data.indexOf(`"dataset":`)
//     const end = res.data.indexOf(`</code>`)
//     if (start != -1 && end !== -1) {
//       const JSON_DATA = JSON.parse(res.data.substring(start + 10, end-1))
//       Update_Price('pd', JSON_DATA.data[0][0], JSON_DATA.data[0][4])
//     }
//   }).catch((error) => {
//     const JSON_DATA = error.response.data
//     if (JSON_DATA['quandl_error'] !== undefined) {
//       Error_Message(cron_url_pall, JSON_DATA['quandl_error']['message'])
//     }
//   })

//   axios.get(cron_url_rhod)
//   .then((res) => {
//     const start = res.data.indexOf(`"dataset":`)
//     const end = res.data.indexOf(`</code>`)
//     if (start != -1 && end !== -1) {
//       const JSON_DATA = JSON.parse(res.data.substring(start + 10, end-1))
//       Update_Price('rh', JSON_DATA.data[0][0], JSON_DATA.data[0][4])
//     }
//   }).catch((error) => {
//     const JSON_DATA = error.response.data
//     if (JSON_DATA['quandl_error'] !== undefined) {
//       Error_Message(cron_url_rhod, JSON_DATA['quandl_error']['message'])
//     }
//   })*/

  

//   // get 3 prices
//   var options = {
//     url: metalsdaily_url,
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'cookie': '__SP4_Shrt=; cookie_consent_performance=1; _ga=GA1.2.1822047097.1596680346;'
//     },
//     form: {
//         com: 'XPTUSD|XPDUSD|RHOUSD'
//     },
//     timeout: 3000
//   };

//   request.post(options, function(error, response, body) {
//       if(!error) {
//         //console.log(body);

//         const data = JSON.parse(body);
//         const prices = data.p;

//         var platinumPrice = 0;
//         var palladiumPrice = 0;
//         var rhPrice = 0;
//         prices.forEach(price => {
//             if(price.a == 'XPTUSD') {
//               platinumPrice = price.c;
//             } else if(price.a == 'XPDUSD') {
//               palladiumPrice = price.c;
//             } else if(price.a == 'RHOUSD') {
//               rhPrice = price.c;
//             }
//         });

//         var currentDateTime = new Date();

//         // update database
//         Update_Price('pt', currentDateTime, platinumPrice);
//         Update_Price('pd', currentDateTime, palladiumPrice);
//         Update_Price('rh', currentDateTime, rhPrice);

//         // set timeout
//         setTimeout(async () => {
//           const pricing = await Pricing.find({ })
//           let res_pricing = {
//             pd: 0,
//             pt: 0,
//             rh: 0
//           }
//           for (let i = 0 ; i < pricing.length ; i += 1) {
//             res_pricing[pricing[i].commodity_type] = pricing[i].price
//           }

//           const converters = await Converter.find({ })
//           for (let i = 0 ; i < converters.length ; i += 1) {
//             const converter_price = PriceServer.calcPrice(res_pricing, converters[i])
//             converters[i]['converter_price'] = converter_price
//             Converter.findOneAndUpdate({_id: converters[i]._id}, {
//               converter_price: converters[i].converter_price,
//               converter_price_last_updated: Date.now()
//               }, {upsert: true}, function(err, doc) {
//             });
//           }

//         }, 30* 1000);
//       }
//   });

// });

// agenda.define('send email report', {priority: 'high', concurrency: 1}, async job => {
//   const {email_to, error_message, request_url} = job.attrs.data;
//   let message=`
//     <div>
//       <p>Hi Vadim, an API call has failed.</p>
//       <p>Get request</p>
//       <p>${request_url}</p>
//       <p>Error Message</p>
//       <p>${error_message}</p>
//     </div>
//   `;
//   var mailOptions = {
//     from: EmailServer.Company_Email,
//     to: email_to,
//     subject: 'Error Message',
//     html: message
//   };
//   EmailServer.transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log('email server', error)
//     }
//   })
// });

// agenda.define('bulk upload', {priority: 'high', concurrency: 1}, async job => {
//   const {email_to, csvs} = job.attrs.data;
//   console.log('bulk upload', email_to, csvs)
//   const total = csvs.length -1
//   let success = 0
//   let message = ''
//   const pricing = await Pricing.find({ })
//   let res_pricing = {
//     pd: 0,
//     pt: 0,
//     rh: 0
//   }
//   for (let i = 0 ; i < pricing.length ; i += 1) {
//     res_pricing[pricing[i].commodity_type] = pricing[i].price
//   }

//   for (let i = 1 ; i < csvs.length ; i += 1) {
//     setTimeout(async () => {
//       const header = csvs[i].split(',')
//       if (header.length < 6) {
//         message += `<p>${i}-Doesn't contain all fields</p>`
//       } else {
//         for (let j = 0 ; j <= 5 ; j += 1) {
//           header[j] = header[j].split(`"`).join(``)
//         }
//         if (header[0].length === 0) {
//           message += `<p>${i}-Identifier can't be empty</p>`
//         }
//         else if (!validator.isFloat(header[1].toString())) {
//           message += `<p>${i}-platinum is NaN</p>`
//         }
//         else if (!validator.isFloat(header[2].toString())) {
//           message += `<p>${i}-palladium is NaN</p>`
//         }
//         else if (!validator.isFloat(header[3].toString())) {
//           message += `<p>${i}-rhodium is NaN</p>`
//         }
//         else if (!validator.isFloat(header[4].toString())) {
//           message += `<p>${i}-weight is NaN</p>`
//         } else {
//           let converter = {
//             identifier: header[0],
//             platinum: Number(header[1]),
//             palladium: Number(header[2]),
//             rhodium: Number(header[3]),
//             weight: Number(header[4]),
//             notes: header[5],
//           }
//           const converter_price = await PriceServer.calcPrice(res_pricing, converter)
//           converter['converter_price'] = converter_price
//           console.log(converter)
//           Converter.create(converter, (err, createdConverter) => {
//             if(err) {
//               console.log('error', i, err)
//               message += `<p>${i}-Unexpected Server Error</p>`
//             } else {
//               createdConverter.save();
//               success += 1
//             }
//           })
//         }
//       }
//     }, i * 100)
//   }
//   setTimeout(() => {
//     message = `Converter list has been processed.
//     Total of ${success} converters were added to the database. ${total - success} converters were rejected. `
//     + message
//     console.log('message', message)
//     var mailOptions = {
//       from: EmailServer.Company_Email,
//       to: email_to,
//       subject: 'Error Message',
//       html: message
//     };
//     EmailServer.transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.log('email server', error)
//       }
//     })
//   }, (csvs.length +1) * 100)
// });


module.exports = { Agenda: agenda}