import { useState } from 'react'
import './GuestForm.css'
import { useLang } from '../i18n'
import { Reveal } from './Reveal'

const RSVP_URL = import.meta.env.VITE_RSVP_URL
const ATTENDANCE_CODES = ['yes', 'plus_one', 'no'] as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function GuestForm() {
  const { lang, t } = useLang()
  const [name, setName] = useState('')
  const [choice, setChoice] = useState(0)
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    try {
      await fetch(RSVP_URL, {
        method: 'POST',
        // text/plain avoids a CORS preflight so Apps Script still records the row.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: name.trim(),
          attendance: ATTENDANCE_CODES[choice],
          lang,
        }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const submitted = status === 'success'

  return (
    <section className="form">
      <Reveal className="form__inner">
        <h2 className="form__title">
          <span className="form__title-text">{t.formTitle}</span>
        </h2>

        {submitted ? (
          <p className="form__thanks">{t.formThanks}</p>
        ) : (
          <>
            <p className="form__subtitle">{t.formSubtitle}</p>
            <p className="form__deadline">{t.formDeadline}</p>

            <form className="form__body" onSubmit={handleSubmit}>
              <label className="form__label" htmlFor="guest-name">
                {t.formNameLabel}
              </label>
              <input
                id="guest-name"
                className="form__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.formNamePlaceholder}
                autoComplete="name"
                required
              />

              <p className="form__question">{t.formAttendQuestion}</p>
              <div className="form__options" role="radiogroup">
                {t.formOptions.map((opt, i) => (
                  <label key={i} className="form__option">
                    <input
                      type="radio"
                      name="attend"
                      className="form__radio-input"
                      checked={choice === i}
                      onChange={() => setChoice(i)}
                    />
                    <span className="form__radio" aria-hidden="true" />
                    <span className="form__option-text">{opt}</span>
                  </label>
                ))}
              </div>

              {status === 'error' && (
                <p className="form__error" role="alert">
                  {t.formError}
                </p>
              )}

              <button
                type="submit"
                className="form__submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? t.formSubmitting : t.formSubmit}
              </button>
            </form>
          </>
        )}
      </Reveal>
    </section>
  )
}
