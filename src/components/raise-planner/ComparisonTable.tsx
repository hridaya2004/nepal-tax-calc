"use client"

import { formatNPR, formatPct } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { CalcResult } from '@/lib/calculate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  current: CalcResult
  target: CalcResult
}

const rows: { labelKey: string; key: keyof CalcResult }[] = [
  { labelKey: 'output.gross', key: 'gross' },
  { labelKey: 'output.ssf', key: 'ssfMonthly' },
  { labelKey: 'output.cit', key: 'citMonthly' },
  { labelKey: 'output.tds', key: 'monthlyTax' },
  { labelKey: 'output.inhand.label', key: 'inhand' },
  { labelKey: 'slab.annual.taxable', key: 'annualTaxable' },
  { labelKey: 'slab.annual.tax', key: 'annualTax' },
]

export function ComparisonTable({ current, target }: Props) {
  const { t } = useApp()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('raise.comparison')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs">
                <th scope="col" className="text-left py-2 font-semibold"></th>
                <th scope="col" className="text-right py-2 font-semibold">{t('raise.current')}</th>
                <th scope="col" className="text-right py-2 font-semibold">{t('raise.target.label')}</th>
                <th scope="col" className="text-right py-2 font-semibold">{t('raise.delta.col')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const cv = current[row.key] as number
                const tv = target[row.key] as number
                const delta = tv - cv
                return (
                  <tr key={row.key} className="border-t border-border/50">
                    <td className="py-2 text-muted-foreground">{t(row.labelKey as any)}</td>
                    <td className="py-2 text-right font-mono text-foreground">{formatNPR(cv)}</td>
                    <td className="py-2 text-right font-mono text-foreground">{formatNPR(tv)}</td>
                    <td className={`py-2 text-right font-mono ${
                      row.key === 'inhand'
                        ? delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        : 'text-muted-foreground'
                    }`}>
                      {delta >= 0 ? '+' : ''}{formatNPR(delta)}
                    </td>
                  </tr>
                )
              })}
              <tr className="border-t border-border">
                <td className="py-2 text-muted-foreground">{t('common.effective.rate')}</td>
                <td className="py-2 text-right font-mono text-foreground">{formatPct(current.effectiveRate)}</td>
                <td className="py-2 text-right font-mono text-foreground">{formatPct(target.effectiveRate)}</td>
                <td className="py-2 text-right font-mono text-muted-foreground">
                  {formatPct(target.effectiveRate - current.effectiveRate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
