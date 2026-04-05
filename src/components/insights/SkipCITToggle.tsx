"use client"

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import { calculate, type CalcOptions, type CalcResult } from '@/lib/calculate'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface Props {
  result: CalcResult
  options: CalcOptions
}

export function SkipCITToggle({ result, options }: Props) {
  const [show, setShow] = useState(false)
  const { t } = useApp()

  const noCitResult = useMemo(
    () => calculate(result.gross, { ...options, includeCIT: false, citAmount: 0 }),
    [result.gross, options]
  )

  if (!options.includeCIT || result.citMonthly <= 0) return null

  const extraInhand = noCitResult.inhand - result.inhand
  const extraTax = noCitResult.annualTax - result.annualTax

  const activeSlab = [...result.slabBreakdown].reverse().find((s) => s.tax > 0)
  const marginalRate = activeSlab?.rate ?? 0
  const subsidyPct = marginalRate * 100

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        aria-expanded={show}
        className="text-xs text-muted-foreground hover:text-foreground/70 transition-colors flex items-center gap-1.5 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-lg"
      >
        <AlertTriangle size={13} aria-hidden="true" />
        {t('insights.skip.cit')}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border-amber-500/25">
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('insights.extra.inhand')}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">+{formatNPR(extraInhand)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('insights.extra.tax')}</span>
                  <span className="font-mono text-red-600 dark:text-red-400">+{formatNPR(extraTax)}</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    CIT is effectively <strong>{subsidyPct.toFixed(0)}% {t('insights.subsidy')}</strong> at your
                    current marginal slab. For every ₨100 you put in, you save ₨{subsidyPct.toFixed(0)} in
                    tax — money that would go to the government instead of your retirement fund.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
