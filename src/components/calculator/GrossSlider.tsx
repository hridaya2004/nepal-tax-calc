"use client"

import { useState, useEffect } from 'react'
import { TAX_CONFIG } from '@/config/tax'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  value: number
  onChange: (v: number) => void
}

export function GrossSlider({ value, onChange }: Props) {
  const { min, max, step } = TAX_CONFIG.ui.slider
  const { t } = useApp()

  const [rawText, setRawText] = useState(Math.round(value).toLocaleString('en-IN'))
  const [isFocused, setIsFocused] = useState(false)

  // Sync display when value changes externally (e.g. from slider)
  useEffect(() => {
    if (!isFocused) {
      setRawText(Math.round(value).toLocaleString('en-IN'))
    }
  }, [value, isFocused])

  return (
    <Card>
      <CardContent>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            {t('gross.label')}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">{t('gross.note')}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-muted-foreground text-lg font-mono">₨</span>
            <input
              type="text"
              inputMode="numeric"
              value={rawText}
              onFocus={() => {
                setIsFocused(true)
                // Select all text on focus for easy replacement
                setRawText(value === 0 ? '' : String(Math.round(value)))
              }}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '')
                setRawText(raw)
                const num = parseInt(raw, 10)
                onChange(isNaN(num) ? 0 : num)
              }}
              onBlur={() => {
                setIsFocused(false)
                // Format nicely on blur
                setRawText(Math.round(value).toLocaleString('en-IN'))
              }}
              className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2.5 text-xl font-mono font-bold text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
          <input
            type="range"
            aria-label={t('gross.label')}
            min={min}
            max={max}
            step={step}
            value={Math.min(value, max)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="mt-3 w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.3)]
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-mono">
            <span>{formatNPR(min)}</span>
            <span>{formatNPR(max)}</span>
          </div>
        </label>
      </CardContent>
    </Card>
  )
}
