import EBayApi from '@hendt/ebay-api'
import { MarketplaceId, SiteId } from '@hendt/ebay-api/lib/enums'

export default new EBayApi({
  appId: process.env.EBAY_APP_ID as string,
  certId: process.env.EBAY_CERT_ID as string,
  sandbox: process.env.EBAY_ENVIRONMENT === 'SANDBOX',
  siteId: SiteId.EBAY_US,
  marketplaceId: MarketplaceId.EBAY_US
})
