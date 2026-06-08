import { useEffect, useRef, useState } from 'react'
import { Hero } from './components/Hero'
import { Invitation } from './components/Invitation'
import { GuestForm } from './components/GuestForm'
import { IntroSequence } from './components/IntroSequence'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Navbar } from './components/Navbar'
import { RobotPeek } from './components/RobotPeek'
import { useLang } from './i18n'
import './App.css'

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [peek, setPeek] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const { t } = useLang()

  useEffect(() => {
    if (!introDone) return
    const el = formRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setPeek(entry.isIntersecting),
      { threshold: 0.06 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [introDone])

  return (
    <main className="app">
      <Navbar dark={introDone} />
      {introDone ? (
        <>
          <RobotPeek visible={peek} />
          <LanguageSwitcher />
          <Hero />
          <Invitation />
          <div ref={formRef}>
            <GuestForm />
          </div>
        </>
      ) : (
        <>
          <LanguageSwitcher />
          <IntroSequence
            welcomeLines={t.welcomeLines}
            buttonLabel={t.enter}
            tapHint={t.tapHint}
            onComplete={() => setIntroDone(true)}
          />
        </>
      )}
    </main>
  )
}
