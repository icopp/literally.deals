import { css } from '@emotion/core'
import useInterval from '@use-it/interval'
import format from 'format-duration'
import he from 'he'
import fetch from 'isomorphic-unfetch'
import { NextComponentType } from 'next'
import React, { FunctionComponent, useState } from 'react'
import FadeLoader from 'react-spinners/FadeLoader'
import SyncLoader from 'react-spinners/SyncLoader'
import useSWR from 'swr'
import { fetcherFn } from 'swr/dist/types'

import FIVE_MINUTES_IN_MS from '~/constants/five-minutes-in-ms'
import EbayItem from '~/typings/ebay-item'

const fetcher: fetcherFn<EbayItem & { bigImageUrl: string | null }> = (
  url: string
) => fetch(url).then(r => r.json())

const Index: NextComponentType = () => {
  const { data, mutate } = useSWR<EbayItem & { bigImageUrl: string | null }>(
    '/api/random-ebay-result',
    fetcher,
    {
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

  const SizedSyncLoader: FunctionComponent = () => <SyncLoader />

  return (
    <div className="container">
      <div className="card my-4">
        <h3 className="card-header text-center">
          {data ? he.decode(data.title) : <SizedSyncLoader />}
        </h3>
        <div className="card-body">
          <div
            className="rounded mx-auto d-flex"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.027451)',
              alignItems: 'center',
              justifyContent: 'center',
              height: '15em',
              width: '15em'
            }}
          >
            {data ? (
              <img
                src={data.bigImageUrl || data.galleryURL}
                className="rounded"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
            ) : (
              <FadeLoader />
            )}
          </div>
          <div className="text-center my-2">
            {data ? (
              <>({he.decode(data.primaryCategory.categoryName)})</>
            ) : (
              <SizedSyncLoader
                css={css`
                  height: 1em;
                `}
              />
            )}
          </div>
          <div className="text-center mt-4">
            <a
              className="btn btn-lg btn-success"
              href={data ? data.viewItemURL : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data ? (
                <>
                  Buy for ${data.sellingStatus.convertedCurrentPrice.toFixed(2)}{' '}
                  {data.shippingInfo.shippingServiceCost === 0 ? (
                    <>with free shipping</>
                  ) : (
                    <>
                      plus ${data.shippingInfo.shippingServiceCost.toFixed(2)}{' '}
                      shipping
                    </>
                  )}
                </>
              ) : (
                <SizedSyncLoader />
              )}
            </a>
          </div>
        </div>
        <div className="card-footer text-muted">
          <div className="text-center">
            {format(FIVE_MINUTES_IN_MS - timePassed)} until the next item
          </div>
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped bg-info"
              role="progressbar"
              aria-valuenow={timePassed}
              aria-valuemin={0}
              aria-valuemax={FIVE_MINUTES_IN_MS}
              style={{
                width: `${(timePassed / FIVE_MINUTES_IN_MS) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
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
Index.displayName = 'Index'
export default Index
