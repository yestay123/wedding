import type { ReactNode } from 'react'
import './RobotChampagne.css'

// Calm, open eyes by default…
const OPEN_PIXELS = [
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
] as const

// …turning into happy "^" arcs while the robot giggles.
const ARC_PIXELS = [
  [0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0],
  [1, 0, 0, 0, 1],
] as const

function PixelGrid({
  pixels,
  className,
}: {
  pixels: readonly (readonly number[])[]
  className: string
}) {
  return (
    <div className={className} aria-hidden="true">
      {pixels.map((row, r) => (
        <div className="rc-eye__row" key={`r-${r}`}>
          {row.map((on, c) => (
            <span
              className={`rc-eye__cell${on ? ' is-on' : ''}`}
              key={`r-${r}-${c}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function PixelEye() {
  return (
    <div className="rc-eye">
      <PixelGrid pixels={OPEN_PIXELS} className="rc-eye__state rc-eye__open" />
      <PixelGrid pixels={ARC_PIXELS} className="rc-eye__state rc-eye__arc" />
    </div>
  )
}

interface RobotChampagneProps {
  message?: ReactNode
}

export function RobotChampagne({ message }: RobotChampagneProps) {
  return (
    <div className="rc">
      <div className="rc__inner">
        <div className="rc__giggle">
          <img
            className="rc__img"
            src="/robot-champagne.svg"
            alt=""
            draggable={false}
          />
          <div className="rc__face" aria-hidden="true">
            <PixelEye />
            <PixelEye />
          </div>
        </div>
      </div>

      {message && <div className="rc__bubble">{message}</div>}
    </div>
  )
}
