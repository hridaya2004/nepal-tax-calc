"use client"

import { useMemo, useState } from 'react'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { EfficiencyChart } from './EfficiencyChart'
import { ComparisonTable } from './ComparisonTable'
import { formatNPR, formatPct } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import { calculate, type CalcOptions, type CalcResult } from '@/lib/calculate'
import { TAX_CONFIG } from '@/config/tax'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface Props {
  currentResult: CalcResult
  options: CalcOptions
}

export function RaisePlanner({ currentResult, options }: Props) {
  const { t } = useApp()
  const [targetGross, setTargetGross] = useState(
    Math.round(currentResult.gross * 1.25 / 5000) * 5000
  )
  const { slider } = TAX_CONFIG.ui

  const targetResult = useMemo(
    () => calculate(targetGross, { ...options, citAmount: Infinity }),
    [targetGross, options]
  )

  const raisePct = currentResult.gross > 0
    ? (targetGross - currentResult.gross) / currentResult.gross
    : 0
  const inhandDelta = targetResult.inhand - currentResult.inhand

  const verdict = TAX_CONFIG.ui.verdicts.find(
    (v) => raisePct >= v.minPct && raisePct < v.maxPct
  )

  const verdictStyles: Record<string, string> = {
    slate: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700/40 dark:text-zinc-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  }

  const bands = useMemo(() => {
    const step = 5000
    const start = currentResult.gross
    const end = Math.max(start, targetGross)
    const result: { from: number; to: number; efficiency: number }[] = []
    for (let g = start; g < end; g += step) {
      const gEnd = Math.min(g + step, end)
      const r1 = calculate(g, options)
      const r2 = calculate(gEnd, options)
      const grossD = gEnd - g
      const inhandD = r2.inhand - r1.inhand
      result.push({ from: g, to: gEnd, efficiency: grossD > 0 ? inhandD / grossD : 0 })
    }
    return result
  }, [currentResult.gross, targetGross, options])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <CardTitle>{t('raise.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block">
            <span className="text-xs text-muted-foreground font-semibold">{t('raise.target')}</span>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="text-muted-foreground font-mono">₨</span>
              <input
                type="text"
                inputMode="numeric"
                value={Math.round(targetGross).toLocaleString('en-IN')}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10)
                  if (!isNaN(v)) setTargetGross(v)
                }}
                className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-lg font-mono font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <input
              type="range"
              min={currentResult.gross}
              max={Math.max(slider.max, currentResult.gross + 200000)}
              step={slider.step}
              value={targetGross}
              onChange={(e) => setTargetGross(Number(e.target.value))}
              className="mt-2 w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
            />
          </label>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t('raise.current')}</p>
              <p className="font-mono text-lg text-foreground">{formatNPR(currentResult.inhand)}</p>
              <p className="text-xs text-muted-foreground">{t('raise.inhand')}</p>
            </div>
            <ArrowRight size={20} className="text-primary" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t('raise.target.label')}</p>
              <p className="font-mono text-lg text-foreground">{formatNPR(targetResult.inhand)}</p>
              <p className="text-xs text-muted-foreground">{t('raise.inhand')}</p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs text-muted-foreground">{t('raise.grosspct')}: </span>
              <AnimatedNumber value={raisePct} format={formatPct} className="font-mono text-sm text-primary font-semibold" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">{t('raise.delta')}: </span>
              <span className={`font-mono text-sm font-semibold ${inhandDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {inhandDelta >= 0 ? '+' : '−'}
                <AnimatedNumber value={Math.abs(inhandDelta)} format={(n) => formatNPR(n).slice(1)} className="" />
              </span>
            </div>
            {verdict && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${verdictStyles[verdict.color]}`}>
                {verdict.label}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <EfficiencyChart bands={bands} />
      <ComparisonTable current={currentResult} target={targetResult} />
    </div>
  )
}
