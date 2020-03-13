require('dotenv').config()

const path = require('path')
const withFonts = require('next-fonts')

module.exports = withFonts({
  target: 'serverless',
  env: {
    EBAY_APP_ID: process.env.EBAY_APP_ID,
    EBAY_CERT_ID: process.env.EBAY_CERT_ID,
    EBAY_ENVIRONMENT: process.env.EBAY_ENVIRONMENT
  },
  webpack(config) {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            type: 'javascript/auto',
            test: /\.mjs$/,
            use: []
          }
        ]
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '~': path.join(__dirname, 'src')
        }
      }
    }
  }
})
