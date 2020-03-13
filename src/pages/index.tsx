import useInterval from '@use-it/interval'
import format from 'format-duration'
import he from 'he'
import fetch from 'isomorphic-unfetch'
import { GetServerSideProps, NextComponentType, NextPageContext } from 'next'
import absoluteUrl from 'next-absolute-url'
import React, { FunctionComponent, useState } from 'react'
import useSWR from 'swr'
import { fetcherFn } from 'swr/dist/types'

import FIVE_MINUTES_IN_MS from '~/constants/five-minutes-in-ms'
import EbayItem from '~/typings/ebay-item'

const fetcher: fetcherFn<EbayItem & { bigImageUrl: string | null }> = (
  url: string
) => fetch(url).then(r => r.json())

const BuyButton: FunctionComponent<{ item: EbayItem }> = ({ item }) => (
  <a
    className="btn btn-lg btn-success"
    href={item.viewItemURL}
    target="_blank"
    rel="noopener noreferrer"
  >
    Buy for ${item.sellingStatus.convertedCurrentPrice.toFixed(2)}{' '}
    {item.shippingInfo.shippingServiceCost === 0 ? (
      <>with free shipping</>
    ) : (
      <>plus ${item.shippingInfo.shippingServiceCost.toFixed(2)} shipping</>
    )}
  </a>
)
BuyButton.displayName = 'BuyButton'

const ProgressBar: FunctionComponent<{
  now: number
  min: number
  max: number
}> = ({ now, min, max }) => (
  <div className="progress">
    <div
      className="progress-bar progress-bar-striped bg-info"
      role="progressbar"
      aria-valuenow={now}
      aria-valuemin={min}
      aria-valuemax={max}
      style={{
        width: `${(now / max) * 100}%`
      }}
    />
  </div>
)
ProgressBar.displayName = 'ProgressBar'

const CardBody: FunctionComponent<{
  item: EbayItem & { bigImageUrl: string | null }
}> = ({ item }) => (
  <div className="card-body">
    <img
      className="rounded mx-auto d-block"
      src={item.bigImageUrl || item.galleryURL}
    />
    <div className="text-center my-2">
      ({he.decode(item.primaryCategory.categoryName)})
    </div>
    <div className="text-center mt-4">
      <BuyButton item={item} />
    </div>
  </div>
)
CardBody.displayName = 'CardBody'

const CardFooter: FunctionComponent<{
  now: number
  min: number
  max: number
}> = ({ now, min, max }) => (
  <div className="card-footer text-muted">
    <div className="text-center">{format(max - now)} until the next item</div>
    <ProgressBar now={now} min={min} max={max} />
  </div>
)
CardFooter.displayName = 'CardBody'

const FooterText: FunctionComponent<{}> = () => (
  <div className="text-center mt-4">
    (put together from a box of scraps by{' '}
    <a
      href="https://github.com/icopp"
      target="_blank"
      rel="noopener noreferrer"
    >
      icopp
    </a>
    )
  </div>
)
FooterText.displayName = 'FooterText'

const Index: NextComponentType<
  NextPageContext,
  { initialData: EbayItem & { bigImageUrl: string | null } },
  { initialData: EbayItem & { bigImageUrl: string | null } }
> = ({ initialData }) => {
  const { data, mutate } = useSWR<EbayItem & { bigImageUrl: string | null }>(
    '/api/random-ebay-result',
    fetcher,
    {
      initialData,
      revalidateOnFocus: false
    }
  )

  const [timePassed, setTimePassed] = useState(0)
  useInterval(() => {
    if (timePassed >= FIVE_MINUTES_IN_MS) {
      mutate()
      setTimePassed(0)
      return
    }

    setTimePassed(timePassed => timePassed + 1000)
  }, 1000)

  return (
    <div className="container">
      {data && (
        <div className="card my-4">
          <h3 className="card-header text-center">{he.decode(data.title)}</h3>
          <CardBody item={data} />
          <CardFooter now={timePassed} min={0} max={FIVE_MINUTES_IN_MS} />
        </div>
      )}
      <FooterText />
    </div>
  )
}
Index.displayName = 'Index'
export default Index

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { origin } = absoluteUrl(req)
  return {
    props: {
      initialData: await fetcher(`${origin}/api/random-ebay-result`)
    }
  }
}
