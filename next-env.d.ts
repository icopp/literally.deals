/// <reference types="next" />
/// <reference types="next/types/global" />

/**
 * @todo Submit to DefinitelyTyped.
 */
declare module 'react-countdown-hook' {
  export default function useCountDown(
    timeToCount?: number,
    interval?: number
  ): [number, (timeToCount?: number) => void]
}
