import { useLang } from '../i18n'
import { RobotChampagne } from './RobotChampagne'
import './Hero.css'

export function Hero() {
  const { t } = useLang()

  return (
    <section className="hero">
      <figure className="hero__polaroid">
        <img src="/polaroid.png" alt="Temirlan & Aruna" draggable={false} />
      </figure>

      <div className="hero__date">
        <span className="hero__date-weekday">{t.ceremonyInvite}</span>
        <span className="hero__date-rule" aria-hidden="true" />
        <p className="hero__date-main">
          {t.ceremonyDay} {t.ceremonyMonthYear}
        </p>
        <span className="hero__date-rule" aria-hidden="true" />
        <span className="hero__date-time">
          {t.ceremonyTimeLabel} {t.ceremonyTime}
        </span>
      </div>

      <RobotChampagne
        message={<span className="rc__bubble-text">{t.robotJoke}</span>}
      />
    </section>
  )
}
