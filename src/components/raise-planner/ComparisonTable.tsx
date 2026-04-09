"use client"

import { formatNPR, formatPct } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { CalcResult } from '@/lib/calculate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  current: CalcResult
  target: CalcResult
}

type RowDef = { labelKey: string; key: keyof CalcResult; highlight?: boolean; multiplier?: number }

const rows: RowDef[] = [
  { labelKey: 'output.gross', key: 'gross' },
  { labelKey: 'output.ssf', key: 'ssfMonthly' },
  { labelKey: 'output.cit', key: 'citMonthly' },
  { labelKey: 'output.tds', key: 'monthlyTax' },
  { labelKey: 'output.inhand.label', key: 'inhand', highlight: true },
  { labelKey: 'output.annual.inhand', key: 'inhand', highlight: true, multiplier: 12 },
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
              {rows.map((row, i) => {
                const m = row.multiplier ?? 1
                const cv = (current[row.key] as number) * m
                const tv = (target[row.key] as number) * m
                const delta = tv - cv
                return (
                  <tr key={`${row.key}-${i}`} className={`border-t ${row.highlight ? 'border-border' : 'border-border/50'}`}>
                    <td className={`py-2.5 ${row.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{t(row.labelKey as any)}</td>
                    <td className="py-2.5 text-right font-mono text-foreground">{formatNPR(cv)}</td>
                    <td className="py-2.5 text-right font-mono text-foreground">{formatNPR(tv)}</td>
                    <td className={`py-2.5 text-right font-mono ${
                      row.highlight
                        ? delta >= 0 ? 'text-positive font-semibold' : 'text-primary font-semibold'
                        : 'text-muted-foreground'
                    }`}>
                      {delta >= 0 ? '+' : ''}{formatNPR(delta)}
                    </td>
                  </tr>
                )
              })}
              <tr className="border-t border-border">
                <td className="py-2.5 text-muted-foreground">{t('common.effective.rate')}</td>
                <td className="py-2.5 text-right font-mono text-foreground">{formatPct(current.effectiveRate)}</td>
                <td className="py-2.5 text-right font-mono text-foreground">{formatPct(target.effectiveRate)}</td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
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
