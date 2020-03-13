import delay from 'delay'
import { NextApiRequest, NextApiResponse } from 'next'
import ora from 'ora'
import { rword } from 'rword'

import ebay from '~/constants/ebay'
import EbayFindResult from '~/typings/ebay-find-result'
import EbayItem from '~/typings/ebay-item'
import { scrapeEbayListingForBigImage } from '~/util'

export default async function randomEbayResult(
  request: NextApiRequest,
  response: NextApiResponse<EbayItem & { bigImageUrl: string | null }>
): Promise<void> {
  const spinner = ora('Finding random Amazon results...').start()

  const randomWord = rword.generateFromPool(1) as string
  spinner.start(`Searching eBay for "${randomWord}".`)

  try {
    const data: EbayFindResult = await ebay.finding.findItemsByKeywords({
      itemFilter: {
        name: 'ValueBoxInventory',
        value: 1
      },
      keywords: randomWord,
      limit: 1,
      sortOrder: 'PricePlusShippingLowest'
    })

    if ((data?.paginationOutput?.totalEntries ?? 0) === 0) {
      throw new Error(
        `Didn't find matching results for "${randomWord}". Retrying...`
      )
    }

    spinner.succeed(
      `Found ${data.paginationOutput.totalEntries} eBay result(s) for "${randomWord}".`
    )

    const item = Array.isArray(data.searchResult.item)
      ? data.searchResult.item[0]
      : data.searchResult.item

    const result = {
      ...item,
      bigImageUrl: item.viewItemURL
        ? await scrapeEbayListingForBigImage(item.viewItemURL)
        : null
    }

    response.status(200).json(result)
  } catch (error) {
    spinner.fail(error.message)
    await delay(1000)
    await randomEbayResult(request, response)
  }
}
