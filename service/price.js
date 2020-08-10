
function calcPrice(pricings, product) {
  product['platinum'] = Number(product['platinum'])
  product['palladium'] = Number(product['palladium'])
  product['rhodium'] = Number(product['rhodium'])
  product['weight'] = Number(product['weight'])
  const NET_PLATINUM_PRICE = pricings['pt'] - ((pricings['pt'] * 0.04 / 360) *  95);
  const NET_PALLADIUM_PRICE = pricings['pd'] - ((pricings['pd'] * 0.04 / 360) *  95);
  const NET_RHODIUM_PRICE = pricings['rh'] - ((pricings['rh'] * 0.08 / 360) *  95);
  const VALUE_OF_PLATINUM_IN_CONVERTER = (product['platinum'] / 1000000) * 14.5833 * product['weight'] * NET_PLATINUM_PRICE;
  const VALUE_OF_PALLADIUM_IN_CONVERTER = (product['palladium'] / 1000000) * 14.5833 * product['weight'] * NET_PALLADIUM_PRICE;
  const VALUE_OF_RHODIUM_IN_CONVERTER = (product['rhodium'] / 1000000) * 14.5833 * product['weight'] * NET_RHODIUM_PRICE;
  const CONVERTER_PRICE = VALUE_OF_PLATINUM_IN_CONVERTER + VALUE_OF_PALLADIUM_IN_CONVERTER + VALUE_OF_RHODIUM_IN_CONVERTER;
  return CONVERTER_PRICE.toFixed(2)
}

module.exports = {
  calcPrice: calcPrice,
}