import './RobotConcierge.css'

const OPEN_PIXELS = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
] as const

const CLOSED_PIXELS = [[1, 1, 1, 1, 1]] as const

function PixelEye() {
  return (
    <div className="pixel-eye">
      <div className="pixel-eye__open" aria-hidden="true">
        {OPEN_PIXELS.map((row, rowIndex) => (
          <div className="pixel-eye__row" key={`open-${rowIndex}`}>
            {row.map((on, colIndex) => (
              <span
                className={`pixel-eye__cell${on ? ' pixel-eye__cell--on' : ''}`}
                key={`open-${rowIndex}-${colIndex}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="pixel-eye__closed" aria-hidden="true">
        {CLOSED_PIXELS.map((row, rowIndex) => (
          <div className="pixel-eye__row" key={`closed-${rowIndex}`}>
            {row.map((on, colIndex) => (
              <span
                className={`pixel-eye__cell${on ? ' pixel-eye__cell--on' : ''}`}
                key={`closed-${rowIndex}-${colIndex}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function RobotConcierge() {
  return (
    <div className="robot-scene" aria-hidden="true">
      <div className="robot-wrapper">
        <div className="robot-container">
          <img
            className="robot"
            src="/robot.svg"
            alt=""
            draggable={false}
          />
          <div className="robot-face">
            <PixelEye />
            <PixelEye />
          </div>
        </div>
      </div>
    </div>
  )
}
