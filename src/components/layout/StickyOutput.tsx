"use client"

import { AnimatedNumber } from '@/components/AnimatedNumber'
import { InhandHero } from '@/components/calculator/InhandHero'
import { SlabWaterfall } from '@/components/calculator/SlabWaterfall'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { CalcResult } from '@/lib/calculate'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowDown, PiggyBank, Receipt, Wallet } from 'lucide-react'

interface Props {
  result: CalcResult
}

export function StickyOutput({ result }: Props) {
  const { t } = useApp()

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <InhandHero result={result} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('output.breakdown')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <Row icon={<Wallet size={14} />} label={t('output.gross')} value={result.gross} color="text-foreground" />
          {result.ssfMonthly > 0 && (
            <Row icon={<ArrowDown size={14} />} label={t('output.ssf')} value={-result.ssfMonthly} color="text-teal-600 dark:text-teal-400" />
          )}
          {result.citMonthly > 0 && (
            <Row icon={<PiggyBank size={14} />} label={t('output.cit')} value={-result.citMonthly} color="text-blue-600 dark:text-blue-400" />
          )}
          <Row icon={<Receipt size={14} />} label={t('output.tds')} value={-result.monthlyTax} color="text-red-600 dark:text-red-400" />
          <Separator />
          <Row icon={<Wallet size={14} />} label={t('output.inhand.label')} value={result.inhand} color="text-primary" bold />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">{t('retirement.title')}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{t('retirement.future')}</p>
          <div className="flex items-center justify-between text-center">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">SSF</p>
              <p className="font-mono text-sm text-teal-600 dark:text-teal-400">{formatNPR(result.ssfMonthly)}</p>
            </div>
            <span className="text-muted-foreground text-lg">+</span>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">CIT</p>
              <p className="font-mono text-sm text-blue-600 dark:text-blue-400">{formatNPR(result.citMonthly)}</p>
            </div>
            <span className="text-muted-foreground text-lg">=</span>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{t('retirement.total')}</p>
              <p className="font-mono text-sm text-primary font-semibold">{formatNPR(result.retirementTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('slab.title')}</CardTitle>
          <CardDescription>{t('slab.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <SlabWaterfall breakdown={result.slabBreakdown} annualTaxable={result.annualTaxable} />
          <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs">
            <span className="text-muted-foreground">{t('slab.annual.taxable')}</span>
            <span className="font-mono text-foreground">{formatNPR(result.annualTaxable)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">{t('slab.annual.tax')}</span>
            <span className="font-mono text-primary">{formatNPR(result.annualTax)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Row({ icon, label, value, color, bold }: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`${color} opacity-70`}>{icon}</span>
        <span className={`text-sm ${bold ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{label}</span>
      </div>
      <span className={`font-mono text-sm ${bold ? 'font-bold' : 'font-medium'} ${color}`}>
        <AnimatedNumber value={Math.abs(value)} format={(n) => `${value < 0 ? '−' : ''}₨ ${Math.round(n).toLocaleString('en-IN')}`} className="" />
      </span>
    </div>
  )
}
