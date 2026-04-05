"use client"

import type { FilingStatus } from '@/config/tax'
import type { CalcOptions } from '@/lib/calculate'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { useState } from 'react'

interface Props {
  options: CalcOptions
  onChange: (patch: Partial<CalcOptions>) => void
}

export function FilingOptions({ options, onChange }: Props) {
  const { t } = useApp()
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground font-semibold">{t('filing.title')}</span>
          <span
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            tabIndex={0}
            role="button"
            aria-label="Filing status info"
          >
            <Info size={14} className="text-muted-foreground/60 hover:text-muted-foreground cursor-help" aria-hidden="true" />
            {showTooltip && (
              <span role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg text-xs text-popover-foreground w-72 z-50 shadow-xl">
                {t('filing.tooltip')}
              </span>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          {(['single', 'couple'] as FilingStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => {
                onChange({ filingStatus: status })
                if (status === 'couple') onChange({ isFemale: false })
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                options.filingStatus === status
                  ? 'bg-primary/15 border-primary/30 text-primary'
                  : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground/70'
              }`}
            >
              {t(status === 'single' ? 'filing.single' : 'filing.couple')}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
