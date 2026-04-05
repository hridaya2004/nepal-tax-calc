"use client"

import { TAX_CONFIG } from '@/config/tax'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { CalcResult, CalcOptions } from '@/lib/calculate'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Sparkles } from 'lucide-react'

interface Props {
  result: CalcResult
  options: CalcOptions
}

interface Item {
  label: string
  active: boolean
  annualSaving: number
  potentialSaving?: number
}

export function TaxSavingSummary({ result, options }: Props) {
  const { t } = useApp()
  const activeSlab = [...result.slabBreakdown].reverse().find((s) => s.tax > 0)
  const marginalRate = activeSlab?.rate ?? 0

  const items: Item[] = [
    {
      label: t('ssf.title'),
      active: options.includeSSF,
      annualSaving: options.includeSSF ? result.ssfAnnual * marginalRate : 0,
      potentialSaving: !options.includeSSF
        ? result.gross * TAX_CONFIG.salary.basicRatio * TAX_CONFIG.ssf.totalRate * 12 * marginalRate
        : undefined,
    },
    {
      label: t('cit.title'),
      active: options.includeCIT && result.citMonthly > 0,
      annualSaving: result.citAnnual * marginalRate,
      potentialSaving: !options.includeCIT
        ? result.maxCitMonthly * 12 * marginalRate
        : undefined,
    },
    {
      label: t('deductions.life'),
      active: options.lifeInsurance > 0,
      annualSaving: options.lifeInsurance * marginalRate,
      potentialSaving: options.lifeInsurance === 0
        ? TAX_CONFIG.deductions.lifeInsurance.max * marginalRate
        : undefined,
    },
    {
      label: t('deductions.health'),
      active: options.healthInsurance > 0,
      annualSaving: options.healthInsurance * marginalRate,
      potentialSaving: options.healthInsurance === 0
        ? TAX_CONFIG.deductions.healthInsurance.max * marginalRate
        : undefined,
    },
    {
      label: t('deductions.building'),
      active: options.buildingInsurance > 0,
      annualSaving: options.buildingInsurance * marginalRate,
      potentialSaving: options.buildingInsurance === 0
        ? TAX_CONFIG.deductions.buildingInsurance.max * marginalRate
        : undefined,
    },
  ]

  if (options.isFemale && options.filingStatus === 'single') {
    const rebateAmt = result.annualTax * TAX_CONFIG.rebates.female.rate / (1 - TAX_CONFIG.rebates.female.rate)
    items.push({
      label: `${t('special.female')} (10%)`,
      active: true,
      annualSaving: rebateAmt,
    })
  }

  const totalSaving = items.reduce((s, i) => s + i.annualSaving, 0)
  const unused = items.filter((i) => !i.active && i.potentialSaving && i.potentialSaving > 0)

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">{t('insights.saving.title')}</span>
        </div>

        <div className="space-y-2.5">
          {items.filter((i) => i.active).map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                −{formatNPR(item.annualSaving)}{t('common.yr')}
              </span>
            </div>
          ))}
        </div>

        {unused.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium mb-2">{t('insights.unclaimed')}</p>
            <div className="space-y-2.5">
              {unused.map((item) => (
                <div key={item.label} className="flex items-center justify-between opacity-60 hover:opacity-90 transition-opacity">
                  <div className="flex items-center gap-2">
                    <X size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400">
                    {t('insights.couldsave')} {formatNPR(item.potentialSaving!)}{t('common.yr')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border flex justify-between">
          <span className="text-sm text-muted-foreground font-semibold">{t('insights.total.saving')}</span>
          <span className="font-mono text-sm text-primary font-bold">{formatNPR(totalSaving)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {t('insights.marginal')} {(marginalRate * 100).toFixed(0)}%
        </p>
      </CardContent>
    </Card>
  )
}
