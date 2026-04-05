"use client"

import { useEffect, useState } from 'react'
import { useSpring, useTransform, useReducedMotion } from 'framer-motion'

interface Props {
  value: number
  format: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, format, className }: Props) {
  const prefersReduced = useReducedMotion()
  const spring = useSpring(value, prefersReduced ? { stiffness: 300, damping: 30 } : { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) => format(v))
  const [text, setText] = useState(format(value))

  useEffect(() => { spring.set(value) }, [value, spring])
  useEffect(() => {
    const unsub = display.on('change', (v) => setText(v))
    return unsub
  }, [display])

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      {text}
    </span>
  )
}
