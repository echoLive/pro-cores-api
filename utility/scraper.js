'use strict';

const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.metalsdaily.com/__dta/pd.ashx';
const {mongoose}  = require('../config/database');
// const agenda = new Agenda({mongo: mongoose.connection });
const Pricing = require('../models/Pricing');

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
        }
    });
};

getPageContent(url);

