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
  tapHint: string
  inviteTitle: string
  inviteGreeting: string
  inviteBody: string
  inviteNames: string
  weekdaysShort: string[]
  calMonth: string
  calWeekdays: string[]
  dateFull: string
  locTitle: string
  locHotel: string
  locHall: string
  locAddress: string
  openMap: string
  countdownTitle: string
  countdownUnits: string[]
  formTitle: string
  formSubtitle: string
  formDeadline: string
  formNameLabel: string
  formNamePlaceholder: string
  formAttendQuestion: string
  formOptions: string[]
  formSubmit: string
  formSubmitting: string
  formError: string
  formThanks: string
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
    tapHint: 'Нажмите сюда',
    inviteTitle: 'ПРИГЛАШАЕМ ВАС',
    inviteGreeting: 'Дорогие родные и близкие!',
    inviteBody:
      'С огромной радостью приглашаем вас стать почётными гостями торжественного вечера, посвящённого свадьбе',
    inviteNames: 'Темирлана и Аруны',
    weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    calMonth: 'Август',
    calWeekdays: ['пятница', 'суббота', 'воскресенье'],
    dateFull: '23 августа 2026',
    locTitle: 'Локация торжества',
    locHotel: 'Отель Hilton',
    locHall: 'Grand Ballroom',
    locAddress: 'Гейдар Алиев, 14',
    openMap: 'Открыть карту',
    countdownTitle: 'До свадьбы осталось',
    countdownUnits: ['дн.', 'ч.', 'мин.', 'сек.'],
    formTitle: 'Анкета гостя',
    formSubtitle: 'Ваш ответ поможет нам лучше подготовиться к празднику.',
    formDeadline: 'Просим подтвердить присутствие до 15.07.2026 г.',
    formNameLabel: 'Введите Имя и Фамилию',
    formNamePlaceholder: 'Имя и Фамилия',
    formAttendQuestion: 'Сможете ли вы присутствовать на торжестве?',
    formOptions: ['Я приду', 'Приду с парой +1', 'Прийти не получится'],
    formSubmit: 'Отправить',
    formSubmitting: 'Отправляем…',
    formError: 'Не удалось отправить. Попробуйте ещё раз.',
    formThanks: 'Спасибо! Ваш ответ записан.',
    ceremonyInvite: 'Приглашаем Вас',
    ceremonyMonthYear: 'Августа 2026',
    ceremonyDay: '23',
    ceremonyTimeLabel: 'Начало',
    ceremonyTime: '17:00',
    robotJoke: 'Инвайт на Google Meet отправим позже... Шутка',
  },
  kk: {
    welcomeLines: [
      'Темірлан мен Арунаның тойына қош келдіңіз!',
      'Кіріңіз — бәрін көрсетемін.',
    ],
    enter: 'Кеттік!',
    tapHint: 'Мұнда басыңыз',
    inviteTitle: 'ШАҚЫРТУ',
    inviteGreeting: 'Қымбатты туыстар мен жақындар!',
    inviteBody:
      'Үйлену тойымызға арналған салтанатты кештің құрметті қонағы болуға зор қуанышпен шақырамыз',
    inviteNames: 'Темірлан мен Аруна',
    weekdaysShort: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жс'],
    calMonth: 'Тамыз',
    calWeekdays: ['жұма', 'сенбі', 'жексенбі'],
    dateFull: '23 тамыз 2026',
    locTitle: 'Той өтетін орын',
    locHotel: 'Hilton қонақ үйі',
    locHall: 'Grand Ballroom',
    locAddress: 'Гейдар Әлиев, 14',
    openMap: 'Картаны ашу',
    countdownTitle: 'Тойға дейін қалды',
    countdownUnits: ['күн', 'сағ', 'мин', 'сек'],
    formTitle: 'Қонақ сауалнамасы',
    formSubtitle: 'Жауабыңыз мерекеге жақсы дайындалуымызға көмектеседі.',
    formDeadline: 'Қатысуыңызды 15.07.2026 ж. дейін растауыңызды сұраймыз.',
    formNameLabel: 'Аты-жөніңізді жазыңыз',
    formNamePlaceholder: 'Аты-жөні',
    formAttendQuestion: 'Тойға қатыса аласыз ба?',
    formOptions: ['Келемін', 'Жұбыммен келемін +1', 'Келе алмаймын'],
    formSubmit: 'Жіберу',
    formSubmitting: 'Жіберілуде…',
    formError: 'Жіберу мүмкін болмады. Қайталап көріңіз.',
    formThanks: 'Рахмет! Жауабыңыз қабылданды.',
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
