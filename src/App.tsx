import { useState } from 'react'
import { Hero } from './components/Hero'
import { IntroSequence } from './components/IntroSequence'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Navbar } from './components/Navbar'
import { useLang } from './i18n'
import './App.css'

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const { t } = useLang()

  return (
    <main className="app">
      <Navbar dark={introDone} />
      {introDone ? (
        <Hero />
      ) : (
        <>
          <LanguageSwitcher />
          <IntroSequence
            welcomeLines={t.welcomeLines}
            buttonLabel={t.enter}
            onComplete={() => setIntroDone(true)}
          />
        </>
      )}
    </main>
  )
}
