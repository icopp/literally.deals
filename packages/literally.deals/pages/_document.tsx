import Document, { Head, Main, NextScript } from 'next/document'

import 'bootswatch/dist/sketchy/bootstrap.min.css'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>literally.deals</title>
          <link rel="favicon" href="/static/favicon.ico" />
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
