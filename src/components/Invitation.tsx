import './Invitation.css'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n'
import { RobotChampagne } from './RobotChampagne'
import { Reveal } from './Reveal'

const ENVELOPE_SRC: Record<string, string> = {
  ru: '/envelope-rus.webp',
  kk: '/envelope-kaz.webp',
}

const WEDDING_DATE = new Date('2026-08-23T17:00:00')
const MAP_URL = 'https://go.2gis.com/IXka4'

function getTimeLeft(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now())
  const totalSec = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSec / 86_400),
    hours: Math.floor((totalSec % 86_400) / 3_600),
    minutes: Math.floor((totalSec % 3_600) / 60),
    seconds: totalSec % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Invitation() {
  const { lang, t } = useLang()
  const envelopeSrc = ENVELOPE_SRC[lang] ?? ENVELOPE_SRC.ru

  const [left, setLeft] = useState(() => getTimeLeft(WEDDING_DATE))
  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft(WEDDING_DATE)), 1000)
    return () => clearInterval(id)
  }, [])

  const countdown = [
    { value: String(left.days), label: t.countdownUnits[0] },
    { value: pad(left.hours), label: t.countdownUnits[1] },
    { value: pad(left.minutes), label: t.countdownUnits[2] },
    { value: pad(left.seconds), label: t.countdownUnits[3] },
  ]

  return (
    <>
      <section className="inv">
        <Reveal as="h2" className="inv__title">
          {t.inviteTitle}
        </Reveal>

        <Reveal className="inv__env" delay={0.1}>
          <img
            className="inv__env-img"
            src={envelopeSrc}
            alt=""
            draggable={false}
          />
        </Reveal>

        <RobotChampagne
          message={<span className="rc__bubble-text">{t.robotJoke}</span>}
        />
      </section>

      <section className="ticket">
        <Reveal className="ticket__inner">
          <picture>
            <source srcSet="/ticket.webp" type="image/webp" />
            <img
              className="ticket__img"
              src="/ticket.png"
              alt=""
              draggable={false}
            />
          </picture>

          <div className="ticket__content">
            <div className="ticket__upper">
              <h3 className="ticket__title">{t.locTitle}</h3>

              <div className="ticket__photo">
                <picture>
                  <source srcSet="/location.webp" type="image/webp" />
                  <img src="/location.jpg" alt="" draggable={false} />
                </picture>
              </div>

              <p className="ticket__hotel">{t.locHotel}</p>
              <p className="ticket__hall">{t.locHall}</p>
              <p className="ticket__addr">{t.locAddress}</p>

              <a
                className="ticket__map"
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
              >
                {t.openMap}
              </a>
            </div>

            <div className="ticket__lower">
              <span className="ticket__count-title">{t.countdownTitle}</span>
              <div className="ticket__count">
                {countdown.map((unit, i) => (
                  <div key={i} className="ticket__count-unit">
                    <span className="ticket__count-num">{unit.value}</span>
                    <span className="ticket__count-lbl">{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
