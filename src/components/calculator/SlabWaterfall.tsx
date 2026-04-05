"use client"

import { motion } from 'framer-motion'
import type { SlabBreakdown } from '@/lib/calculate'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'

const SLAB_COLORS: Record<string, string> = {
  '1% SST': '#6ee7b7',
  '10%': '#2dd4bf',
  '20%': '#eab308',
  '30%': '#f97316',
  '36%': '#ef4444',
  '39%': '#dc2626',
}

interface Props {
  breakdown: SlabBreakdown[]
  annualTaxable: number
}

export function SlabWaterfall({ breakdown, annualTaxable }: Props) {
  const { t } = useApp()

  if (annualTaxable <= 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        {t('slab.notaxable')}
      </div>
    )
  }

  const maxIncome = Math.max(...breakdown.map((s) => s.income), 1)

  return (
    <div className="space-y-2.5">
      {breakdown.map((slab, i) => {
        const pct = slab.income / maxIncome
        const color = SLAB_COLORS[slab.label] || '#6ee7b7'
        return (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground font-semibold">{slab.label}</span>
              <span className="text-muted-foreground font-mono">
                {formatNPR(slab.tax)}
              </span>
            </div>
            <div className="h-7 bg-secondary/60 rounded-md overflow-hidden relative">
              <motion.div
                className="h-full rounded-md"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(pct * 100, 3)}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.06 }}
              />
              <span className="absolute inset-0 flex items-center px-2.5 text-xs font-mono font-semibold text-black/80 dark:text-black/70">
                {formatNPR(slab.income)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
