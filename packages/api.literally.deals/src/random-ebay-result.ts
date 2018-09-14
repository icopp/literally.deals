import fetch from 'isomorphic-fetch'
import delay from 'delay'
import ora from 'ora'
import queryString from 'query-string'
import rword from 'rword'

import EBAY_FIND_SETTINGS from './constants/ebay-find-settings'
import EbayFindResponse from './typings/ebay-find-response'

const ebayResultUrlForKeywords = (keywords: string) =>
  `${
    process.env.EBAY_API_SERVER
  }/services/search/FindingService/v1?${queryString.stringify({
    ...EBAY_FIND_SETTINGS,
    keywords
  })}`

const fetchEbayResultForKeywords = (
  keywords: string
): Promise<EbayFindResponse> =>
  fetch(ebayResultUrlForKeywords(keywords)).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json()
  })

const ebayResultCount = (result: EbayFindResponse) =>
  parseInt(result.findItemsByKeywordsResponse[0].searchResult[0]['@count'], 10)

export default function randomEbayResult(): Promise<{
  title: string
  galleryUrl: string
  viewItemUrl: string
  categoryName: string
  currency: string
  price: number
  shippingPrice: number
}> {
  const spinner = new ora('Finding random Amazon results...').start()

  const randomWord = rword.generateFromPool(1)
  spinner.start(`Searching eBay for "${randomWord}".`)

  return fetchEbayResultForKeywords(randomWord)
    .then(data => {
      if (ebayResultCount(data) === 0 || !isFinite(ebayResultCount(data))) {
        throw new Error(
          `Didn't find matching results for "${randomWord}". Retrying...`
        )
      }

      spinner.succeed(
        `Found ${ebayResultCount(data)} eBay result(s) for "${randomWord}".`
      )

      return {
        title:
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0].title[0],
        galleryUrl:
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0]
            .galleryURL[0],
        viewItemUrl:
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0]
            .viewItemURL[0],
        categoryName:
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0]
            .primaryCategory[0].categoryName[0],
        currency:
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0]
            .sellingStatus[0].currentPrice[0]['@currencyId'],
        price: parseFloat(
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0]
            .sellingStatus[0].currentPrice[0].__value__
        ),
        shippingPrice: parseFloat(
          data.findItemsByKeywordsResponse[0].searchResult[0].item[0]
            .shippingInfo[0].shippingServiceCost[0].__value__
        )
      }
    })
    .catch((e: Error) => {
      spinner.fail(e.message)
      return delay(1000).then(() => randomEbayResult())
    })
}
