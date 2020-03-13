import EbayItem from './ebay-item'

export default interface EbayFindResult {
  version: string
  timestamp: string
  searchResult: {
    item: EbayItem | EbayItem[]
  }
  paginationOutput: {
    pageNumber: number
    entriesPerPage: number
    totalPages: number
    totalEntries: number
  }
  itemSearchURL: string
}
