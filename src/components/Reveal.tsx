import { motion, type HTMLMotionProps } from 'framer-motion'

type RevealTag = 'div' | 'section' | 'figure' | 'h2' | 'p'

interface RevealProps extends HTMLMotionProps<'div'> {
  /** Which element to render. Defaults to a div. */
  as?: RevealTag
  /** Stagger delay in seconds. */
  delay?: number
  /** Vertical travel distance in px. */
  y?: number
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Fades and rises its children into view the first time they enter the
 * viewport. Renders a real element (no extra wrapper layout) so it can replace
 * existing tags without changing the layout.
 */
export function Reveal({
  as = 'div',
  delay = 0,
  y = 30,
  children,
  ...rest
}: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
