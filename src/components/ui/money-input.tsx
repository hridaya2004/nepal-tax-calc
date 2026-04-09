"use client"

import { useState, useEffect } from 'react'

interface MoneyInputProps {
  value: number
  onChange: (v: number) => void
  label?: string
  note?: string
  min?: number
  max?: number
  step?: number
  showSlider?: boolean
  showRange?: boolean
  size?: 'default' | 'sm'
  placeholder?: string
  prefix?: string
  formatRange?: (n: number) => string
  ariaLabel?: string
}

export function MoneyInput({
  value,
  onChange,
  label,
  note,
  min = 0,
  max,
  step = 5000,
  showSlider = true,
  showRange = false,
  size = 'default',
  placeholder = '0',
  prefix = '₨',
  formatRange,
  ariaLabel,
}: MoneyInputProps) {
  const [rawText, setRawText] = useState(value > 0 ? Math.round(value).toLocaleString('en-IN') : '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setRawText(value > 0 ? Math.round(value).toLocaleString('en-IN') : '')
    }
  }, [value, isFocused])

  const textSize = size === 'sm' ? 'text-sm' : 'text-lg'
  const pySize = size === 'sm' ? 'py-2.5' : 'py-3' // min 44px touch target

  return (
    <label className="block">
      {label && (
        <span className="text-xs text-muted-foreground uppercase tracking-[0.1em] font-semibold">
          {label}
        </span>
      )}
      {note && <p className="text-[11px] text-muted-foreground mt-0.5">{note}</p>}
      <div className={`${label || note ? 'mt-2' : ''} flex items-center gap-3`}>
        <span className="text-muted-foreground font-mono">{prefix}</span>
        <input
          type="text"
          inputMode="numeric"
          aria-label={ariaLabel || label || undefined}
          value={rawText}
          placeholder={placeholder}
          onFocus={() => {
            setIsFocused(true)
            setRawText(value === 0 ? '' : String(Math.round(value)))
          }}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '')
            setRawText(raw)
            const num = parseInt(raw, 10)
            const clamped = isNaN(num) ? 0 : max !== undefined ? Math.min(num, max) : num
            onChange(Math.max(0, clamped))
          }}
          onBlur={() => {
            setIsFocused(false)
            setRawText(value > 0 ? Math.round(value).toLocaleString('en-IN') : '')
          }}
          className={`flex-1 bg-background border-2 border-border rounded-lg px-4 ${pySize} ${textSize} font-mono font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors`}
        />
      </div>
      {showSlider && max !== undefined && (
        <>
          <input
            type="range"
            aria-label={ariaLabel || label || undefined}
            min={min}
            max={max}
            step={step}
            value={Math.min(value, max)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="mt-3 w-full"
          />
          {showRange && formatRange && (
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5 font-mono">
              <span>{formatRange(min)}</span>
              <span>{formatRange(max)}</span>
            </div>
          )}
        </>
      )}
    </label>
  )
}
