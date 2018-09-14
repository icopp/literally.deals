import Document, { Head, Main, NextScript } from 'next/document'

import 'bootswatch/dist/sketchy/bootstrap.min.css'

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="author" content="Ian Copp" />
          <meta name="description" content={`"Those sure are some deals that exist."`} />
          <meta itemprop="name" content="literally.deals" />
          <meta itemprop="description" content={`"Those sure are some deals that exist."`} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="literally.deals" />
          <meta name="twitter:description" content={`"Those sure are some deals that exist."`} />
          <meta name="twitter:creator" content="@copp_ian" />
          <meta name="og:title" content="literally.deals" />
          <meta name="og:description" content={`"Those sure are some deals that exist."`} />
          <meta name="og:url" content="https://literally.deals" />
          <meta name="og:site_name" content="literally.deals" />
          <meta name="fb:admins" content="1340190059" />
          <meta name="fb:app_id" content="468200460029799" />
          <meta name="og:type" content="website" />
          <title>literally.deals</title>
          <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
