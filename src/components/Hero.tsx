import './Hero.css'
import { Calendar } from './Calendar'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__stage">
        <img
          className="hero__pattern"
          src="/love-pattern.png"
          alt=""
          draggable={false}
        />

        <figure className="hero__polaroid">
          <picture>
            <source srcSet="/polaroid.webp" type="image/webp" />
            <img src="/polaroid.jpg" alt="Temirlan & Aruna" draggable={false} />
          </picture>
        </figure>
      </div>

      <div className="hero__calendar">
        <Calendar />
      </div>
    </section>
  )
}
