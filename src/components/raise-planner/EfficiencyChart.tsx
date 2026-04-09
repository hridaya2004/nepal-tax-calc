"use client"

import { motion } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface Band {
  from: number
  to: number
  efficiency: number
}

interface Props {
  bands: Band[]
}

export function EfficiencyChart({ bands }: Props) {
  const { t } = useApp()

  if (bands.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('raise.efficiency')}</CardTitle>
          <CardDescription>Set a target higher than current gross</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('raise.efficiency')}</CardTitle>
        <CardDescription>{t('raise.efficiency.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {bands.map((band, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-16 shrink-0 text-right">
                {(band.from / 1000).toFixed(0)}K
              </span>
              <div className="flex-1 h-6 bg-secondary rounded-md overflow-hidden">
                <motion.div
                  className="h-full rounded-md"
                  style={{
                    backgroundColor:
                      band.efficiency > 0.7 ? 'var(--positive)' :
                      band.efficiency > 0.5 ? 'var(--warm)' :
                      band.efficiency > 0.3 ? 'var(--primary)' : 'var(--destructive)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(band.efficiency * 100, 1)}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.02 }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-10 shrink-0">
                {(band.efficiency * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
