export default interface EbayFindResponse {
  findItemsByKeywordsResponse: [
    {
      ack: [string]
      version: [string]
      timestamp: [string]
      searchResult: [
        {
          '@count': string
          item: {
            itemId: [string]
            title: [string]
            globalId: [string]
            primaryCategory: [{ categoryId: [string]; categoryName: string[] }]
            galleryURL: [string]
            viewItemURL: [string]
            productId: [{ '@type': string; __value__: string }]
            paymentMethod: string[]
            autoPay: [string]
            location: [string]
            country: [string]
            shippingInfo: [
              {
                shippingServiceCost: [
                  { '@currencyId': string; __value__: string }
                ]
                shippingType: [string]
                shipToLocations: [string]
                expeditedShipping: ['true' | 'false']
                oneDayShippingAvailable: ['true' | 'false']
                handlingTime: [string]
              }
            ]
            sellingStatus: [
              {
                currentPrice: [{ '@currencyId': string; __value__: string }]
                convertedCurrentPrice: [
                  { '@currencyId': string; __value__: string }
                ]
                sellingState: [string]
                timeLeft: [string]
              }
            ]
            listingInfo: [
              {
                bestOfferEnabled: ['true' | 'false']
                buyItNowAvailable: ['true' | 'false']
                startTime: [string]
                endTime: [string]
                listingType: [string]
                gift: ['true' | 'false']
              }
            ]
            returnsAccepted: ['true' | 'false']
            condition: [
              {
                conditionId: [string]
                conditionDisplayName: [string]
              }
            ]
            isMultiVariationListing: ['true' | 'false']
            topRatedListing: ['true' | 'false']
          }[]
        }
      ]
      paginationOutput: [
        {
          pageNumber: [string]
          entriesPerPage: [string]
          totalPages: [string]
          totalEntries: [string]
        }
      ]
      itemSearchURL: [string]
    }
  ]
}
