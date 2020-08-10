const mongoose = require('mongoose');
const Converter = require('../models/Converter');

const seedProducts = () => {
  Converter.deleteMany({}, (err) => {
    if(err) {
      console.log(err);
    }
    console.log('CONVERTERS REMOVED');
    let converters = []
    for (let i = 0 ; i < 155 ; i += 1) {
      const ii = i % 20;
      converters.push({
        identifier: `ID${ii}`,
        images: [],
        make: `Make${ii}`,
        model: `Model${ii}`,
        year: `201${ii}`,
        price: `10${ii}`,
        notes: `Lorem ipsum dolor sit amet${ii}`,
      })
    }
    converters.forEach((converter) => {
      Converter.create(converter, (err, createdConverter) => {
        if(err) {
          console.log(err);
        } else {
          console.log('CONVERTER CREATED');
          createdConverter.save();
        }
      })
    })
  })
}

module.exports = seedProducts;