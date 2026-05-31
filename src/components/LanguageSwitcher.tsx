import { useLang, type Lang } from '../i18n'
import './LanguageSwitcher.css'

const OPTIONS: { code: Lang; label: string }[] = [
  { code: 'ru', label: 'РУС' },
  { code: 'kk', label: 'ҚАЗ' },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {OPTIONS.map((opt, i) => (
        <span className="lang-switch__item" key={opt.code}>
          {i > 0 && <span className="lang-switch__divider" aria-hidden="true" />}
          <button
            type="button"
            className={`lang-switch__btn${lang === opt.code ? ' is-active' : ''}`}
            aria-pressed={lang === opt.code}
            onClick={() => setLang(opt.code)}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  )
}
