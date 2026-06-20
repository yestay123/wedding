import './Calendar.css'
import { useLang } from '../i18n'
import { Reveal } from './Reveal'

const CALENDAR_SRC: Record<string, { webp: string; png: string }> = {
  ru: { webp: '/calendar-rus.webp', png: '/calendar-rus.png' },
  kk: { webp: '/calendar-kaz.webp', png: '/calendar-kaz.png' },
  en: { webp: '/calendar-eng.webp', png: '/calendar-eng.png' },
}

export function Calendar() {
  const { lang, t } = useLang()
  const src = CALENDAR_SRC[lang] ?? CALENDAR_SRC.ru

  return (
    <Reveal as="figure" className="cal">
      <figcaption className="cal__date">
        <span className="cal__date-stack">
          {/* Split into per-word spans with no whitespace between them so
              Android Chrome's text classifier can't detect a date pattern and
              annotate it (which misparsed the Russian month as September). */}
          <span className="cal__date-text">
            {t.dateFull.split(' ').map((word, i) => (
              <span className="cal__date-word" key={i}>
                {word}
              </span>
            ))}
          </span>
          <span className="cal__date-time">
            {t.ceremonyTimeLabel} · {t.ceremonyTime}
          </span>
        </span>
      </figcaption>

      <picture>
        <source srcSet={src.webp} type="image/webp" />
        <img className="cal__img" src={src.png} alt="" draggable={false} />
      </picture>
    </Reveal>
  )
}
