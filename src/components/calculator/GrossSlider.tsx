"use client"

import { TAX_CONFIG } from '@/config/tax'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { MoneyInput } from '@/components/ui/money-input'

interface Props {
  value: number
  onChange: (v: number) => void
}

export function GrossSlider({ value, onChange }: Props) {
  const { min, max, step } = TAX_CONFIG.ui.slider
  const { t } = useApp()

  return (
    <Card>
      <CardContent>
        <MoneyInput
          value={value}
          onChange={onChange}
          label={t('gross.label')}
          note={t('gross.note')}
          min={min}
          max={max}
          step={step}
          showSlider
          showRange
          formatRange={formatNPR}
        />
      </CardContent>
    </Card>
  )
}
