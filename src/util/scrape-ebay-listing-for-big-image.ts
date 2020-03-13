import fetch from 'isomorphic-unfetch'

const BIG_IMAGE_REGEXP = /class="img img\d00" .*? src="(.*?)"/

export default async function scrapeEbayListing(
  listingUrl: string
): Promise<string | null> {
  const response = await fetch(listingUrl)

  if (!response.ok || !response.body) {
    throw new Error(response.statusText)
  }

  const text = await response.text()
  const matches = text.match(BIG_IMAGE_REGEXP)

  return matches?.[1] ?? null
}
