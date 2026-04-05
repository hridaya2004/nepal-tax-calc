"use client"

import { AnimatedNumber } from '@/components/AnimatedNumber'
import { formatPct } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { CalcResult } from '@/lib/calculate'

interface Props {
  result: CalcResult
}

export function InhandHero({ result }: Props) {
  const { t } = useApp()

  return (
    <div className="text-center py-2 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl pointer-events-none" />
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 relative font-semibold">{t('output.inhand')}</p>
      <div className="relative">
        <span className="text-muted-foreground text-2xl md:text-3xl font-mono mr-1">₨</span>
        <AnimatedNumber
          value={result.inhand}
          format={(n) => Math.round(n).toLocaleString('en-IN')}
          className="text-4xl md:text-5xl font-mono font-bold text-foreground tracking-tight"
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-sm relative">
        <span className="text-muted-foreground">
          {t('output.effective')}:{' '}
          <AnimatedNumber
            value={result.effectiveRate}
            format={(n) => formatPct(n)}
            className="text-primary font-mono font-semibold"
          />
        </span>
      </div>
    </div>
  )
}
