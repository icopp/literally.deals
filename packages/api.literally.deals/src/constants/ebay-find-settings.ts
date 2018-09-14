const EBAY_FIND_SETTINGS = {
  'OPERATION-NAME': 'findItemsByKeywords',
  'SERVICE-VERSION': '1.0.0',
  'SECURITY-APPNAME': process.env.EBAY_APP_ID,
  'RESPONSE-DATA-FORMAT': 'JSON',
  'REST-PAYLOAD': null,
  'itemFilter.name': 'ValueBoxInventory',
  'itemFilter.value': 1,
  sortOrder: 'PricePlusShippingLowest'
}
export default EBAY_FIND_SETTINGS
