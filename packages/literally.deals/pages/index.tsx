import getSymbolFromCurrency from 'currency-symbol-map'
import format from 'format-duration'
import fetch from 'isomorphic-fetch'
import { NextContext } from 'next'
import getConfig from 'next/config'
import React from 'react'
import Timer from 'tiny-timer'

const FIVE_MINUTES_MS = 60 * 5 * 1000
const {
  publicRuntimeConfig: { API_SERVER }
} = getConfig()

interface DealResult {
  bigImageUrl: string
  title: string
  galleryUrl: string
  viewItemUrl: string
  categoryName: string
  currency: string
  price: number
  shippingPrice: number
}

interface Props {
  initialDeal: DealResult
}

interface State {
  deal: DealResult | null
  tick: number
}

const fetchDeal = async () => {
  if (!API_SERVER) {
    throw new Error(`API_SERVER is required.`)
  }

  const response = await fetch(`${API_SERVER}/deal`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const deal: DealResult = await response.json()
  return deal
}

export default class Index extends React.Component<
  { initialDeal: DealResult },
  State
> {
  static readonly displayName = 'Index'

  static async getInitialProps(_: NextContext): Promise<Props> {
    if (!API_SERVER) {
      throw new Error(`API_SERVER is required.`)
    }

    return { initialDeal: await fetchDeal() }
  }

  readonly state: State = {
    deal: null,
    tick: 0
  }

  private timer = new Timer({ stopwatch: true })

  updateTick = (ms: number) => {
    this.setState(state => ({ ...state, tick: ms }))
  }

  finishTimer = async () => {
    const newDeal = await fetchDeal()
    this.setState(state => ({ ...state, deal: newDeal }))
    this.timer.stop()
    this.timer.start(FIVE_MINUTES_MS)
  }

  componentDidMount() {
    const { initialDeal } = this.props
    this.setState(state => ({ ...state, deal: initialDeal }))
    this.timer.addListener('tick', this.updateTick)
    this.timer.addListener('done', this.finishTimer)
    this.timer.start(FIVE_MINUTES_MS)
  }

  componentWillUnmount() {
    this.timer.removeListener('tick', this.updateTick)
    this.timer.removeListener('done', this.finishTimer)
    this.timer.stop()
  }

  render() {
    const { initialDeal } = this.props
    const { deal, tick } = this.state

    return (
      <div className="container">
        {deal && (
          <div className="card my-4">
            <h3 className="card-header text-center">{initialDeal.title}</h3>
            <div className="card-body">
              <img
                className="rounded mx-auto d-block"
                src={initialDeal.bigImageUrl || initialDeal.galleryUrl}
              />
              <div className="text-center my-2">
                ({initialDeal.categoryName})
              </div>
              <div className="text-center mt-4">
                <a
                  className="btn btn-lg btn-success"
                  href={initialDeal.viewItemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy for {getSymbolFromCurrency(initialDeal.currency)}
                  {initialDeal.price.toFixed(2).replace('.', ' . ')}{' '}
                  {initialDeal.shippingPrice === 0 && (
                    <React.Fragment>with free shipping</React.Fragment>
                  )}
                  {initialDeal.shippingPrice !== 0 && (
                    <React.Fragment>
                      plus {getSymbolFromCurrency(initialDeal.currency)}
                      {initialDeal.shippingPrice
                        .toFixed(2)
                        .replace('.', ' . ')}{' '}
                      shipping
                    </React.Fragment>
                  )}
                </a>
              </div>
            </div>
            <div className="card-footer text-muted">
              <div className="text-center">
                {format(FIVE_MINUTES_MS - tick)} until the next item
              </div>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                  role="progressbar"
                  aria-valuenow={tick}
                  aria-valuemin={0}
                  aria-valuemax={FIVE_MINUTES_MS}
                  style={{ width: `${(tick / FIVE_MINUTES_MS) * 100}%` }}
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
}
