import fetch from 'isomorphic-fetch'

const BIG_IMAGE_REGEXP = /class="img img\d00" .*? src="(.*?)"/

export default async function scrapeEbayListing(
  listingUrl: string
): Promise<{ bigImageUrl: string | null }> {
  const response = await fetch(listingUrl)

  if (!response.ok || !response.body) {
    throw new Error(response.statusText)
  }

  const text = await response.text()
  const matches = text.match(BIG_IMAGE_REGEXP)

  return {
    bigImageUrl: matches && matches[1]
  }
}
