const express = require('express');
const Pricing = require('../models/Pricing');
const User = require('../models/User');
const Converter = require('../models/Converter');
const requireLogin = require('../middleware/requireLogin');
const converterSearchData = require('../middleware/converterSearchData');
const converterAddPartData = require('../middleware/converterAddPartData');
const getAllUsersData = require('../middleware/getAllUsersData');
var base64Img = require('base64-img');
var Base64 = require('js-base64').Base64;
const PriceServer = require('../service/price');
var randomstring = require("randomstring");
const router = express.Router();
var AWS = require('aws-sdk');
const RES = require('../constants/response').RES
// const Agenda = require('../price_cron/cron').Agenda
const ConvertRate = require('../models/CovertRate');

// Configure AWS to use promise
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({
  accessKeyId: 'AKIAJ57WQJZZ6LWSBYTA',
  secretAccessKey: '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', 
  region: 'us-east-1' 
});

var s3Bucket = new AWS.S3( { params: {Bucket: 'wozjobs'} } );

router.get('/get_rate', (req, res) => {
  ConvertRate.find({}).exec((err, result) => {    
    if (err) {
      res.json({
        status: 'error',
        data: -1
      });
      return
    } else {
      console.log(result);
      if(result.length > 0 ) {
        res.json({
          status: 'success',
          data: result[0].rate
        });
        return
      } else if (result.length == 0) {
        res.json({
          status: 'success',
          data: 100
        }); 
        return 
      } else {
        res.json({
          status: 'success',
          data: result.rate
        }); 
        return 
      }
    }     
  })
})

router.post('/set_rate', async (req, res) => {
  const data = req.body

  ConvertRate.find({}).exec((err, result) => {
    if (err){
      res.json({
        success: 0,
        message: RES.ERROR_Rate_UPLOAD,
      });
      return
    } else {
      console.log(result);

      if(result.length == 0 ) {
        const newRate = {
          rate: data.rate,
        }
        ConvertRate.create(newRate, (err, createdRate) => {
          if (err){
            res.json({
              success: 0,
              message: RES.ERROR_Rate_UPLOAD,
            });
            return
          } else {
            createdRate.save();
            res.json({
              success: 1,
            });
            return
          }  
        })
      } else if (result.length > 0) {  
        ConvertRate.updateOne({}, {
          rate: data.rate
        }, function(err){
          if (err){
            res.json({
              success: 0,
              message: RES.ERROR_Rate_UPLOAD,
            });
            return
          } else {
            res.json({
              success: 1,
            });
            return
          }
        }) 
      }
    }
  })
})


router.post('/edit_part', /*- requireLogin,*/ converterAddPartData, async(req, res) => {
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
  const pricing = await Pricing.find({ })
  let res_pricing = {
    pd: 0,
    pt: 0,
    rh: 0
  }
  for (let i = 0 ; i < pricing.length ; i += 1) {
    res_pricing[pricing[i].commodity_type] = pricing[i].price
  }
  const converter_price = PriceServer.calcPrice(res_pricing, data)
  data['converter_price'] = converter_price

  await Converter.findOneAndUpdate({_id: data._id},  {$set:{
    price: data.price,
    identifier: data.identifier,
    make: data.make,
    model: data.model,
    year: data.year,
    notes: data.notes,
    images: data.images,
    platinum: data.platinum,
    palladium: data.palladium,
    rhodium: data.rhodium,
    weight: data.weight,
    converter_price: data.converter_price,
    converter_price_last_updated: Date.now()
    }}, {upsert: true}, function(err, doc) {
  });
  res.send({
    success: 1,
    message: RES.UPDATE_SUCCESS
  })
})

router.post('/remove_part', /*- requireLogin,*/ getAllUsersData, async(req, res) => {
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
  var query = Converter.remove({ _id: data.id });
  query.exec();
  res.send({
    success: 1,
    message: RES.SUCCESS_REMOVED
  })
})

router.post('/csv_uploader', /*- requireLogin,*/ async(req, res) => {
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
  try {
    const csvs = Base64.decode(req.body.data.split('base64,')[1])
    const converters = csvs.split('\n')
    const header = converters[0].split(',')
    if (header[0].indexOf('identifier') == -1 || header[1].indexOf('platinum') == -1
    || header[2].indexOf('palladium') == -1 || header[3].indexOf('rhodium') == -1
    || header[4].indexOf('weight') == -1 || header[5].indexOf('notes') == -1)
    {
      res.send ({
        success: 0,
        message: RES.CSV_HEADER_ERROR
      })
      return;
    }
    console.log('convet', converters, req.body.email, Agenda)
    // Agenda.now(
    //   'bulk upload', 
    //   {
    //     email_to: req.body.email,
    //     csvs: converters,
    //   }
    // );
    res.send({
      success: 1,
      message: RES.SUCCESS_CSV_UPLOAD
    })
  } catch (e) {
    res.send({
      success: 0,
      message: RES.SERVER_ERROR
    })
  }
})

router.post('/add_part', /*- requireLogin,*/ converterAddPartData, async(req, res) => {
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
  const converter = req.body
  for (let i = 0 ; i < converter.images.length ; i += 1) {
    // const base64 = converter.images[i].split(",")[1];
    // const type = converter.images[i].split(';')[0].split('/')[1];
    // console.log('type', type, base64)
    // const key = await  randomstring.generate({
    //   length: 12,
    //   charset: 'alphabetic'
    // });
    // const url = base64Img.base64(`uploads/${key}.${type}`)
    // var filepath = base64Img.imgSync(base64, 'uploads', `${key}.${type}`);
    // console.log('url', filepath)
    // const data = {
    //   Key: `${key}.${type}`,
    //   Body: base64Data,
    //   ACL: 'public-read',
    //   ContentEncoding: 'base64',
    //   ContentType: `image/${type}`
    // };
    // const s3res = await s3Bucket.upload(data).promise();
    // console.log(s3res);
  }
  const pricing = await Pricing.find({ })
  let res_pricing = {
    pd: 0, 
    pt: 0, 
    rh: 0
  }
  for (let i = 0 ; i < pricing.length ; i += 1) {
    res_pricing[pricing[i].commodity_type] = pricing[i].price
  }
  const converter_price = PriceServer.calcPrice(res_pricing, converter)
  converter['converter_price'] = converter_price
  Converter.create(converter, (err, createdConverter) => {
    if(err) {
      res.send({
        success: 0,
        message: RES.SERVER_ERROR
      })
    } else {
      createdConverter.save();
      res.send({
        success: 1,
        message: RES.SUCCESS_CREATED
      })
    }
  })
})

router.post('/get_converters', /*- requireLogin,*/ converterSearchData, async(req, res) => {
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
  let filters = req.body
  filters.identifier = filters.identifier.toLowerCase()
  try {
    const converters = await Converter.find({ }).sort({ created_on: 'desc' })
    const filterConverters = await converters.filter((item) => {
      if (filters.identifier.length > 0 && item.identifier.toLowerCase().indexOf(filters.identifier) === -1) {
        return false
      }
      if (filters.make != 'Any' && item.make != filters.make) {
        return false
      }
      if (filters.model != 'Any' && item.model != filters.model) {
        return false
      }
      return true;
    })
    let makes = ['Any']
    let models = ['Any']
    for (let i = 0 ; i < filterConverters.length ; i += 1) {
      if (makes.indexOf(filterConverters[i].make) === -1) {
        makes.push(filterConverters[i].make)
      }
      if (models.indexOf(filterConverters[i].model) === -1) {
        models.push(filterConverters[i].model)
      }
    }
    const resultConverters = await filterConverters.slice(10 * (filters.activePage - 1), 10 * filters.activePage)
    res.send({
      success: 1,
      message: RES.SUCCESS_FETCH,
      data: resultConverters,
      total: filterConverters.length,
      makes: makes,
      models: models,
    })
  } catch {
    res.send({
      success: 0,
      message: RES.SERVER_ERROR
    })
  }
})



router.get('/get_prices', /*- requireLogin,*/ async(req, res) => {
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
  const pricing = await Pricing.find({ })
  let res_pricing = {
    pd: 0, 
    pt: 0, 
    rh: 0
  }
  for (let i = 0 ; i < pricing.length ; i += 1) {
    res_pricing[pricing[i].commodity_type] = pricing[i].price
  }
  res.send({
    success: 1,
    message: RES.SUCCESS_FETCH,
    data: {
      pricings: res_pricing
    }
  })
})

router.get('/get_model_make_types', /*- requireLogin,*/ async(req, res) => {
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
  const converters = await Converter.find({ })
  let makes = ['Any']
  let models = ['Any']
  for (let i = 0 ; i < converters.length ; i += 1) {
    if (makes.indexOf(converters[i].make) === -1) {
      makes.push(converters[i].make)
    }
    if (models.indexOf(converters[i].model) === -1) {
      models.push(converters[i].model)
    }
  }
  res.send({
    success: 1,
    message: RES.SUCCESS_FETCH,
    data: {
      makes: makes,
      models: models,
      total: converters.length
    }
  })
})

module.exports = router;