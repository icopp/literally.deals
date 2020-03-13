import format from 'format-duration'
import he from 'he'
import fetch from 'isomorphic-unfetch'
import { GetServerSideProps, NextComponentType, NextPageContext } from 'next'
import absoluteUrl from 'next-absolute-url'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { fetcherFn } from 'swr/dist/types'
import Timer from 'tiny-timer'

import FIVE_MINUTES_IN_MS from '~/constants/five-minutes-in-ms'
import EbayItem from '~/typings/ebay-item'

const fetcher: fetcherFn<EbayItem & { bigImageUrl: string | null }> = (
  url: string
) => fetch(url).then(r => r.json())

const Index: NextComponentType<
  NextPageContext,
  { initialData: EbayItem & { bigImageUrl: string | null } },
  { initialData: EbayItem & { bigImageUrl: string | null } }
> = ({ initialData }) => {
  const { data, mutate } = useSWR<EbayItem & { bigImageUrl: string | null }>(
    '/api/random-ebay-result',
    fetcher,
    {
      initialData
    }
  )

  const [tick, setTick] = useState<number>(0)
  const timer = useMemo(() => new Timer({ interval: 500, stopwatch: true }), [])
  const finishTimer = useCallback(() => {
    mutate()
    timer.stop()
    timer.start(FIVE_MINUTES_IN_MS)
  }, [])
  useEffect(() => {
    timer.addListener('tick', setTick)
    timer.addListener('done', finishTimer)
    timer.start(FIVE_MINUTES_IN_MS)

    return function(): void {
      timer.removeListener('tick', setTick)
      timer.removeListener('done', finishTimer)
      timer.stop()
    }
  }, [])

  return (
    <div className="container">
      {data && (
        <div className="card my-4">
          <h3 className="card-header text-center">{he.decode(data.title)}</h3>
          <div className="card-body">
            <img
              className="rounded mx-auto d-block"
              src={data.bigImageUrl || data.galleryURL}
            />
            <div className="text-center my-2">
              ({he.decode(data.primaryCategory.categoryName)})
            </div>
            <div className="text-center mt-4">
              <a
                className="btn btn-lg btn-success"
                href={data.viewItemURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy for ${data.sellingStatus.convertedCurrentPrice.toFixed(2)}{' '}
                {data.shippingInfo.shippingServiceCost === 0 ? (
                  <>with free shipping</>
                ) : (
                  <>
                    plus ${data.shippingInfo.shippingServiceCost.toFixed(2)}{' '}
                    shipping
                  </>
                )}
              </a>
            </div>
          </div>
          <div className="card-footer text-muted">
            <div className="text-center">
              {format(FIVE_MINUTES_IN_MS - tick)} until the next item
            </div>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                role="progressbar"
                aria-valuenow={tick}
                aria-valuemin={0}
                aria-valuemax={FIVE_MINUTES_IN_MS}
                style={{ width: `${(tick / FIVE_MINUTES_IN_MS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
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
    </div>
  )
}
export default Index

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { origin } = absoluteUrl(req)
  return {
    props: {
      initialData: await fetcher(`${origin}/api/random-ebay-result`)
    }
  }
}
