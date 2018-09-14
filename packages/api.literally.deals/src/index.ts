import apicache from 'apicache'
import cors from 'cors'
import express, { Request, Response } from 'express'

import randomEbayResult from './random-ebay-result'
import scrapeEbayListing from './scrape-ebay-listing'

apicache.options({
  debug: process.env.NODE_ENV === 'development'
})

const app = express()
  .use(
    cors({
      origin: process.env.NODE_ENV === 'development'
    })
  )
  .use(
    apicache.middleware(
      '5 minutes',
      (_: Request, res: Response) => res.statusCode === 200
    )
  )
  .get(
    '/deal',

    (req, res, next) => {
      req.accepts('application/json')

      randomEbayResult()
        .then(result => {
          scrapeEbayListing(result.viewItemUrl)
            .then(({ bigImageUrl }) => {
              res.json({
                ...result,
                bigImageUrl
              })
              next()
            })
            .catch(() => {
              res.json({
                ...result,
                bigImage: null
              })
              next()
            })
        })
        .catch(next)
    }
  )

async function main() {
  try {
    const port = process.env.NODE_ENV === 'development' ? 8080 : 80
    app.listen(port, () => {
      console.log(`Listening at port ${port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
