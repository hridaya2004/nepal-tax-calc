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
        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-lg underline underline-offset-2"
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
            <Card className="mt-2">
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('insights.extra.inhand')}</span>
                  <span className="font-mono text-positive font-medium">+{formatNPR(extraInhand)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('insights.extra.tax')}</span>
                  <span className="font-mono text-primary font-medium">+{formatNPR(extraTax)}</span>
                </div>
                <div className="bg-warm/8 border border-warm/15 rounded-lg p-4">
                  <p className="text-xs text-warm">
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
