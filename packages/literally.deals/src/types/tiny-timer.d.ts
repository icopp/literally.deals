/**
 * @todo Submit to DefinitelyTyped.
 */
declare module 'tiny-timer' {
  import { EventEmitter } from 'events'

  /**
   * @event tick
   * @event done
   */
  export default class Timer extends EventEmitter {
    /** The current time in ms. */
    readonly time: number

    /** The total duration the timer is running for in ms. */
    readonly duration: number

    /** The current status of the timer as a string. */
    readonly status: 'running' | 'paused' | 'stopped'

    constructor(opts?: { interval?: number; stopwatch?: boolean })

    /**
     * Starts timer running.
     * @param duration A duration specified in ms
     * @param interval Optionally overide the default refresh interval in ms
     */
    start(duration: number, interval?: number): void

    /** Stops timer. */
    stop(): void

    /** Pauses timer. */
    pause(): void

    /** Resumes timer. */
    resume(): void
  }
}
