import './RobotPeek.css'

// Expression frames on a 5x3 pixel grid. The whole robot is rotated 180deg,
// so frames are authored to read correctly once flipped.
const OPEN = [
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
] as const

const LOOK_A = [
  [0, 1, 1, 0, 0],
  [1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0],
] as const

const LOOK_B = [
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 0],
] as const

const BLINK = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
] as const

// Authored as a downward chevron so the 180deg flip turns it into a happy "^".
const HAPPY = [
  [1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0],
] as const

function PixelGrid({
  pixels,
  className,
}: {
  pixels: readonly (readonly number[])[]
  className: string
}) {
  return (
    <div className={className}>
      {pixels.map((row, r) => (
        <div className="peek-eye__row" key={`r-${r}`}>
          {row.map((on, c) => (
            <span
              className={`peek-eye__cell${on ? ' is-on' : ''}`}
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
    <div className="peek-eye">
      <PixelGrid pixels={OPEN} className="peek-eye__state peek-eye__open" />
      <PixelGrid pixels={LOOK_A} className="peek-eye__state peek-eye__look-a" />
      <PixelGrid pixels={LOOK_B} className="peek-eye__state peek-eye__look-b" />
      <PixelGrid pixels={BLINK} className="peek-eye__state peek-eye__blink" />
      <PixelGrid pixels={HAPPY} className="peek-eye__state peek-eye__happy" />
    </div>
  )
}

export function RobotPeek({ visible }: { visible: boolean }) {
  return (
    <div className={`peek${visible ? ' peek--in' : ''}`} aria-hidden="true">
      <div className="peek__slide">
        <div className="peek__bob">
          <div className="peek__invert">
            <img
              className="peek__img"
              src="/robot-champagne.svg"
              alt=""
              draggable={false}
            />
            <div className="peek__face">
              <PixelEye />
              <PixelEye />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
