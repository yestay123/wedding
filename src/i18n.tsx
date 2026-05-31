import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'ru' | 'kk'

export interface Translations {
  welcomeLines: string[]
  enter: string
  ceremonyInvite: string
  ceremonyMonthYear: string
  ceremonyDay: string
  ceremonyTimeLabel: string
  ceremonyTime: string
  robotJoke: string
}

const STRINGS: Record<Lang, Translations> = {
  ru: {
    welcomeLines: [
      'Добро пожаловать на свадьбу Темирлана и Аруны!',
      'Проходите — я всё покажу.',
    ],
    enter: 'Полетели!',
    ceremonyInvite: 'Приглашаем Вас',
    ceremonyMonthYear: 'Августа 2026',
    ceremonyDay: '23',
    ceremonyTimeLabel: 'Начало',
    ceremonyTime: '17:00',
    robotJoke: 'Инвайт на Google Meet отправим позже... шутка.',
  },
  kk: {
    welcomeLines: [
      'Темірлан мен Арунаның тойына қош келдіңіз!',
      'Кіріңіз — бәрін көрсетемін.',
    ],
    enter: 'Кеттік!',
    ceremonyInvite: 'Сіздерді шақырамыз',
    ceremonyMonthYear: 'Тамыз 2026',
    ceremonyDay: '23',
    ceremonyTimeLabel: 'Басталуы',
    ceremonyTime: '17:00',
    robotJoke: 'Google Meet шақыруын кейінірек жібереміз... әзіл.',
  },
}

const STORAGE_KEY = 'wedding-lang'

function readInitialLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ru' || saved === 'kk') return saved
  }
  return 'ru'
}

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({ lang, setLang, t: STRINGS[lang] }),
    [lang, setLang],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLang must be used within a LanguageProvider')
  }
  return ctx
}
