import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

/** Parent that staggers its <Item> children when scrolled into view. */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  amount = 0.2,
  id,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  amount?: number
  id?: string
}) {
  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Staggered child: rises, unblurs, fades in. Direction via `from`. */
export function Item({
  children,
  className,
  from = 'up',
}: {
  children: ReactNode
  className?: string
  from?: 'up' | 'left' | 'right'
}) {
  const reduce = useReducedMotion()
  const offset = from === 'up' ? { y: 32 } : from === 'left' ? { x: -36 } : { x: 36 }
  const variants: Variants = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, filter: 'blur(6px)', ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.8, ease: EASE },
        },
      }
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}

/** Emerald hairline that draws itself across when scrolled to. */
export function GlowDivider() {
  const reduce = useReducedMotion()
  return (
    <div className="px-5 md:px-8">
      <motion.div
        className="max-w-[1120px] mx-auto h-px origin-center bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1, ease: EASE }}
      />
    </div>
  )
}

/** Mask-reveal child for use inside <Stagger>: slides up from behind an overflow-hidden wrapper. */
export function MaskItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const variants: Variants = reduce
    ? { hidden: { y: '0%' }, visible: { y: '0%' } }
    : {
        hidden: { y: '115%' },
        visible: { y: '0%', transition: { duration: 0.9, ease: EASE } },
      }
  return (
    <span className={`block overflow-hidden ${className ?? ''}`}>
      <motion.span className="block" variants={variants}>
        {children}
      </motion.span>
    </span>
  )
}

/** Editorial mask reveal: the line slides up from behind an overflow-hidden wrapper. */
export function LineReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <span className={`block overflow-hidden ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, amount: 0.1, margin: '0px 0px -5% 0px' }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}
