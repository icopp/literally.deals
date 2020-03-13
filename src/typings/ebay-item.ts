export default interface EbayItem {
  itemId: number
  title: string
  globalId: string
  primaryCategory: { categoryId: number; categoryName: string }
  galleryURL: string
  viewItemURL: string
  productId: number
  paymentMethod: string
  autoPay: boolean
  location: string
  country: string
  shippingInfo: {
    shippingServiceCost: number
    shippingType: string
    shipToLocations: string
    expeditedShipping: boolean
    oneDayShippingAvailable: boolean
    handlingTime: number
  }
  sellingStatus: {
    currentPrice: number
    convertedCurrentPrice: number
    sellingState: string
    timeLeft: string
  }
  listingInfo: {
    bestOfferEnabled: boolean
    buyItNowAvailable: boolean
    startTime: string
    endTime: string
    listingType: string
    gift: boolean
  }
  returnsAccepted: boolean
  condition: { conditionId: number; conditionDisplayName: string }
  isMultiVariationListing: boolean
  topRatedListing: boolean
}
