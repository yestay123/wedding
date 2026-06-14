import { useCallback, useEffect, useRef, useState } from 'react'
import './IntroSequence.css'

/**
 * Plays the wedding-robot intro:
 *   1. Fly-in   (0 -> LOOP_START) plays once on mount
 *   2. Float    (LOOP_START <-> LOOP_END) loops seamlessly while we wait
 *   3. Fly-out  (LOOP_END -> EXIT_END) plays once when the user sends a message
 *
 * While the robot floats it "chats" with the guest: its welcome lines arrive as
 * incoming message bubbles, and pressing Enter sends an outgoing bubble back,
 * which hands off to the fly-out segment.
 */

const LOOP_START = 2.0
const LOOP_END = 6.7
const EXIT_END = 7.9

const WELCOME_LINES = [
  'Добро пожаловать на свадьбу Темирлана и Аруны!',
  'Проходите - я всё покажу.',
]

type Phase = 'intro' | 'exiting'

interface ChatMessage {
  id: number
  from: 'bot' | 'user'
  // For bot messages, the index into the (live) welcomeLines so the text stays
  // reactive to language switching. User messages render the current buttonLabel.
  lineIndex?: number
}

interface IntroSequenceProps {
  src?: string
  buttonLabel?: string
  tapHint?: string
  welcomeLines?: string[]
  onComplete?: () => void
}

export function IntroSequence({
  src = '/wedding-robot-clean.mp4',
  buttonLabel = 'Полетели!',
  tapHint = 'Нажмите сюда',
  welcomeLines = WELCOME_LINES,
  onComplete,
}: IntroSequenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const phaseRef = useRef<Phase>('intro')
  const seqStartedRef = useRef(false)
  const idRef = useRef(0)

  const [settled, setSettled] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [faded, setFaded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [canEnter, setCanEnter] = useState(false)
  const [needsTap, setNeedsTap] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // React doesn't reliably set the muted *property* (only the attribute), and
    // iOS only autoplays inline video when it is actually muted. Force it here.
    video.muted = true
    video.defaultMuted = true

    let raf = 0
    let finished = false

    const tick = () => {
      const v = videoRef.current
      if (!v || finished) return

      if (phaseRef.current === 'intro') {
        if (v.currentTime >= LOOP_END && !v.seeking) {
          v.currentTime = LOOP_START
        }
        if (v.currentTime >= LOOP_START) {
          setSettled(true)
        }
      } else {
        if (v.currentTime >= EXIT_END) {
          finished = true
          setFaded(true)
          window.setTimeout(() => onComplete?.(), 450)
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      video.muted = true
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true))
      }
    }

    if (video.readyState >= 2) start()
    else video.addEventListener('loadeddata', start, { once: true })

    raf = requestAnimationFrame(tick)

    // If autoplay never kicks in (e.g. iOS Low Power Mode), surface the tap gate.
    const guard = window.setTimeout(() => {
      const v = videoRef.current
      if (v && v.paused) setNeedsTap(true)
    }, 800)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(guard)
      video.removeEventListener('loadeddata', start)
    }
  }, [onComplete])

  const handleStart = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => {})
  }, [])

  // Drive the robot's incoming messages once it has settled into the float loop.
  useEffect(() => {
    if (!settled || seqStartedRef.current) return
    seqStartedRef.current = true

    const timers: number[] = []
    let delay = 500

    welcomeLines.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setTyping(true), delay),
      )
      delay += 1100
      timers.push(
        window.setTimeout(() => {
          setTyping(false)
          idRef.current += 1
          setMessages((prev) => [
            ...prev,
            { id: idRef.current, from: 'bot', lineIndex: i },
          ])
        }, delay),
      )
      delay += 650
    })

    timers.push(window.setTimeout(() => setCanEnter(true), delay))

    return () => {
      timers.forEach((t) => clearTimeout(t))
    }
    // welcomeLines is captured once; the sequence is guarded by seqStartedRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled])

  const handleEnter = useCallback(() => {
    const video = videoRef.current
    if (!video || phaseRef.current === 'exiting' || !canEnter) return

    setCanEnter(false)
    idRef.current += 1
    setMessages((prev) => [
      ...prev,
      { id: idRef.current, from: 'user' },
    ])

    window.setTimeout(() => {
      phaseRef.current = 'exiting'
      setExiting(true)
      if (video.currentTime < LOOP_END) {
        video.currentTime = LOOP_END
      }
      void video.play().catch(() => {})
    }, 650)
  }, [buttonLabel, canEnter])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleEnter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleEnter])

  return (
    <div className={`intro${faded ? ' intro--faded' : ''}`}>
      <video
        ref={videoRef}
        className="intro__video"
        src={src}
        muted
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
      />

      {needsTap && !exiting && !faded && (
        <button
          type="button"
          className="intro__start"
          onClick={handleStart}
          aria-label={tapHint}
        >
          <span className="intro__start-ring" aria-hidden="true" />
          <span className="intro__start-text">{tapHint}</span>
        </button>
      )}

      <div
        className={`intro__chat${exiting ? ' intro__chat--out' : ''}`}
        aria-live="polite"
      >
        {messages.map((msg) => {
          const text =
            msg.from === 'bot'
              ? welcomeLines[msg.lineIndex ?? 0] ?? ''
              : buttonLabel
          return (
            <div key={msg.id} className={`bubble-row bubble-row--${msg.from}`}>
              <div className={`bubble bubble--${msg.from}`}>{text}</div>
            </div>
          )
        })}

        {typing && (
          <div className="bubble-row bubble-row--bot">
            <div className="bubble bubble--bot bubble--typing" aria-label="typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className={`intro__ui${canEnter && !exiting ? ' is-visible' : ''}`}>
        <button
          type="button"
          className="intro__button"
          onClick={handleEnter}
          disabled={!canEnter || exiting}
        >
          <span className="intro__button-label">{tapHint}</span>
        </button>
      </div>
    </div>
  )
}
