/**
 * @todo Submit to DefinitelyTyped.
 */
declare module 'ebay-node-api' {
  interface eBayOpts {
    /**
     * Client ID from the eBay developer program.
     */
    clientID: string

    clientSecret?: string

    body?: { grant_type: 'client_credentials' }

    /**
     * A limit to the number of items in each response.
     */
    limit?: number

    /**
     * If true, get user details info.
     */
    details?: boolean
  }

  interface LegacyIdOpts {
    legacyItemId: number
    legacyVariationSku?: string | null
  }

  interface SearchItemsOpts {
    keyword: string

    /** A number as a string */
    limit: string

    filter?: { price?: string; priceCurrency?: string; conditions?: string }
  }

  export default class eBay {
    constructor(opts: eBayOpts)

    getAccessToken(): Promise<{ access_token: string }>

    findItemsByKeywords(keyword: string): Promise<any>

    getAllCategories(): Promise<any>

    findItemsByCategory(category: number): Promise<any>

    /**
     * An access token from the getAccessToken call.
     */
    getItem(accessToken: string): Promise<any>

    getItemByLegacyId(opts: LegacyIdOpts): Promise<any>

    getItemByItemGroup(group: string): Promise<any>

    searchItems(opts: SearchItemsOpts): Promise<any>

    getDefaultCategoryTreeId(
      base: string
    ): Promise<{ categoryTreeId: string; categoryTreeVersion: string }>

    getCategoryTree(categoryTreeId: number): Promise<any>

    getCategorySubtree(
      categoryTreeId: number,
      categorySubtreeId: number
    ): Promise<any>

    getCategorySuggestions(
      categoryTreeId: number,
      keywords: string
    ): Promise<any>

    getItemAspectsForCategory(
      categoryTreeId: number,
      category: number
    ): Promise<any>
  }
}
