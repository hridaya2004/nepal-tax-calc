"use client"

import { TAX_CONFIG } from '@/config/tax'
import { formatNPR } from '@/lib/format'
import { useApp } from '@/lib/app-context'
import type { CalcOptions } from '@/lib/calculate'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface Props {
  gross: number
  options: CalcOptions
  maxCitMonthly: number
  onChange: (patch: Partial<CalcOptions>) => void
}

export function DeductionToggles({ gross, options, maxCitMonthly, onChange }: Props) {
  const { t } = useApp()
  const { retirementCap } = TAX_CONFIG
  const annualGross = gross * 12
  const absCapBinds = retirementCap.absoluteMax <= annualGross * retirementCap.ratioMax
  const capLabel = absCapBinds
    ? t('retirement.hardcap')
    : `${t('retirement.thirdrule')} (${formatNPR(annualGross * retirementCap.ratioMax)}${t('common.yr')})`

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('retirement.title')}</CardTitle>
        <CardDescription>{capLabel}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* SSF */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">{t('ssf.title')}</span>
              <span className="block text-xs text-muted-foreground">
                {t('ssf.desc')}
              </span>
            </div>
            <Switch
              checked={options.includeSSF}
              onCheckedChange={(v: boolean) => onChange({ includeSSF: v })}
            />
          </label>
          {options.includeSSF && (
            <div className="pl-1 text-xs text-muted-foreground font-mono">
              Employee 11% · Employer 20% · Basic {formatNPR(gross * TAX_CONFIG.salary.basicRatio)}
            </div>
          )}
        </div>

        {/* CIT */}
        <div className="space-y-1.5 pt-1 border-t border-border">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">{t('cit.title')}</span>
              <span className="block text-xs text-muted-foreground">
                {t('cit.max')}: {formatNPR(maxCitMonthly)}{t('common.mo')}
              </span>
            </div>
            <Switch
              checked={options.includeCIT}
              onCheckedChange={(v: boolean) => onChange({ includeCIT: v, citAmount: v ? Infinity : 0 })}
            />
          </label>
          {options.includeCIT && (
            <div className="space-y-1.5 pl-1">
              <input
                type="range"
                aria-label={t('cit.title')}
                min={0}
                max={Math.round(maxCitMonthly)}
                step={100}
                value={Math.min(options.citAmount, Math.round(maxCitMonthly))}
                onChange={(e) => onChange({ citAmount: Number(e.target.value) })}
                className="w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
              />
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-muted-foreground">₨ 0</span>
                <span className="text-primary font-semibold">{formatNPR(Math.min(options.citAmount, maxCitMonthly))}</span>
                <span className="text-muted-foreground">{formatNPR(maxCitMonthly)}</span>
              </div>
              <button
                onClick={() => onChange({ citAmount: Infinity })}
                className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {t('cit.usemax')}
              </button>
              {gross > 125_000 && (
                <div className="bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 rounded-md p-2 mt-1">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {t('cit.paradox')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Insurance deductions */}
        <div className="space-y-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('deductions.title')}</p>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <span className="text-sm text-foreground">{t('deductions.life')}</span>
              <span className="block text-xs text-muted-foreground">{formatNPR(TAX_CONFIG.deductions.lifeInsurance.max)}{t('common.yr')} {t('common.cap')}</span>
            </div>
            <Switch
              checked={options.lifeInsurance > 0}
              onCheckedChange={(v: boolean) => onChange({ lifeInsurance: v ? TAX_CONFIG.deductions.lifeInsurance.max : 0 })}
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <span className="text-sm text-foreground">{t('deductions.health')}</span>
              <span className="block text-xs text-muted-foreground">{formatNPR(TAX_CONFIG.deductions.healthInsurance.max)}{t('common.yr')} {t('common.cap')}</span>
            </div>
            <Switch
              checked={options.healthInsurance > 0}
              onCheckedChange={(v: boolean) => onChange({ healthInsurance: v ? TAX_CONFIG.deductions.healthInsurance.max : 0 })}
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <div>
              <span className="text-sm text-foreground">{t('deductions.building')}</span>
              <span className="block text-xs text-muted-foreground">{t('common.upto')} {formatNPR(TAX_CONFIG.deductions.buildingInsurance.max)}{t('common.yr')}</span>
            </div>
            <Switch
              checked={options.buildingInsurance > 0}
              onCheckedChange={(v: boolean) => onChange({ buildingInsurance: v ? TAX_CONFIG.deductions.buildingInsurance.max : 0 })}
            />
          </label>

          <div>
            <label className="text-sm text-foreground block mb-1">{t('deductions.donation')}</label>
            <input
              type="text"
              inputMode="numeric"
              value={options.donationAnnual > 0 ? Math.round(options.donationAnnual).toLocaleString('en-IN') : ''}
              placeholder="0"
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0
                const maxDonation = Math.min(
                  TAX_CONFIG.deductions.donation.maxAbsolute,
                  Math.round(gross * 12 * TAX_CONFIG.deductions.donation.maxPctOfTaxable)
                )
                onChange({ donationAnnual: Math.min(v, maxDonation) })
              }}
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('cit.max')}: {formatNPR(Math.min(
                TAX_CONFIG.deductions.donation.maxAbsolute,
                Math.round(gross * 12 * TAX_CONFIG.deductions.donation.maxPctOfTaxable)
              ))} ({t('deductions.donation.cap')})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
