"use client"

import { useMemo, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ModeSelector, type IncomeMode } from '@/components/layout/ModeSelector'
import { StickyOutput } from '@/components/layout/StickyOutput'
import { GrossSlider } from '@/components/calculator/GrossSlider'
import { DeductionToggles } from '@/components/calculator/DeductionToggles'
import { FilingOptions } from '@/components/calculator/FilingOptions'
import { SpecialSituations } from '@/components/calculator/SpecialSituations'
import { SkipCITToggle } from '@/components/insights/SkipCITToggle'
import { TaxGuide } from '@/components/insights/TaxGuide'
import { TaxSavingSummary } from '@/components/insights/TaxSavingSummary'
import { RaisePlanner } from '@/components/raise-planner/RaisePlanner'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { TAX_CONFIG } from '@/config/tax'
import { useApp } from '@/lib/app-context'
import { calculate, type CalcOptions } from '@/lib/calculate'
import { formatNPR, formatPct } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Calculator, TrendingUp, Sparkles, Globe, Laptop, Plane, Info, AlertTriangle, Sun, Moon, Languages } from 'lucide-react'

type Section = 'calculator' | 'raise' | 'insights'

export default function Page() {
  const { t, theme, setTheme, lang, setLang } = useApp()
  const [mode, setMode] = useState<IncomeMode>('nepal')
  const [section, setSection] = useState<Section>('calculator')
  const [gross, setGross] = useState<number>(TAX_CONFIG.ui.defaults.gross)

  const [options, setOptions] = useState<CalcOptions>({
    filingStatus: 'single',
    includeSSF: true,
    includeCIT: true,
    citAmount: Infinity,
    lifeInsurance: 0,
    healthInsurance: 0,
    buildingInsurance: 0,
    donationAnnual: 0,
    remoteAreaGrade: 'none',
    hasDisability: false,
    isSeniorCitizen: false,
    isFemale: false,
    foreignTaxPaidAnnual: 0,
  })

  const handleOptionsChange = useCallback((patch: Partial<CalcOptions>) => {
    setOptions((prev) => {
      const next = { ...prev, ...patch }
      if (patch.filingStatus === 'couple') next.isFemale = false
      return next
    })
  }, [])

  const result = useMemo(() => calculate(gross, options), [gross, options])

  const sections: { id: Section; label: string; icon: typeof Calculator }[] = [
    { id: 'calculator', label: t('section.calculator'), icon: Calculator },
    { id: 'raise', label: t('section.raise'), icon: TrendingUp },
    { id: 'insights', label: t('section.insights'), icon: Sparkles },
  ]

  return (
    <div className="min-h-screen">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="Nepal flag">🇳🇵</span>
                {t('app.title')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'ne' : 'en')}
                aria-label={lang === 'en' ? 'Switch to Nepali' : 'English मा बदल्नुहोस्'}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-secondary/60 hover:bg-secondary px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Languages size={14} aria-hidden="true" />
                {t('lang.toggle')}
              </button>
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-secondary/60 hover:bg-secondary px-2.5 py-1.5 rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
                {theme === 'dark' ? t('theme.light') : t('theme.dark')}
              </button>
            </div>
          </div>
          <ModeSelector value={mode} onChange={setMode} />
        </div>
      </header>

      <main id="main" className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {mode === 'nepal' && (
            <motion.div
              key="nepal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <nav aria-label="Calculator sections" className="flex gap-1 mb-6 bg-secondary/40 rounded-xl p-1 max-w-md" role="tablist">
                {sections.map((s) => {
                  const Icon = s.icon
                  const active = section === s.id
                  return (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={active}
                      aria-controls={`section-${s.id}`}
                      onClick={() => setSection(s.id)}
                      className={`relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="section-pill"
                          className="absolute inset-0 bg-card border border-border rounded-lg shadow-sm"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon size={13} aria-hidden="true" />
                        {s.label}
                      </span>
                    </button>
                  )
                })}
              </nav>

              <AnimatePresence mode="wait">
                {section === 'calculator' && (
                  <motion.div key="calc" id="section-calculator" role="tabpanel" aria-label={t('section.calculator')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    <div className="space-y-4">
                      <GrossSlider value={gross} onChange={setGross} />
                      <DeductionToggles gross={gross} options={options} maxCitMonthly={result.maxCitMonthly} onChange={handleOptionsChange} />
                      <FilingOptions options={options} onChange={handleOptionsChange} />
                      <SpecialSituations options={options} onChange={handleOptionsChange} />
                      <SkipCITToggle result={result} options={options} />
                      <TaxGuide />
                    </div>
                    <div className="lg:sticky lg:top-24 lg:self-start">
                      <StickyOutput result={result} />
                    </div>
                  </motion.div>
                )}
                {section === 'raise' && (
                  <motion.div key="raise" id="section-raise" role="tabpanel" aria-label={t('section.raise')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RaisePlanner currentResult={result} options={options} />
                  </motion.div>
                )}
                {section === 'insights' && (
                  <motion.div key="insights" id="section-insights" role="tabpanel" aria-label={t('section.insights')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl">
                    <TaxSavingSummary result={result} options={options} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {mode === 'foreign' && (
            <motion.div key="foreign" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <ForeignMode />
            </motion.div>
          )}
          {mode === 'freelancer' && (
            <motion.div key="freelancer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <FreelancerMode />
            </motion.div>
          )}
          {mode === 'nonresident' && (
            <motion.div key="nonresident" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <NonResidentMode />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border mt-12 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t('footer.disclaimer')}
        </p>
      </footer>
    </div>
  )
}

/* ─── Foreign Employment Mode ──────────────────────────────────────── */

const ZERO_TAX = ['UAE', 'Saudi Arabia', 'Bahrain', 'Kuwait', 'Oman']
const DTAA = ['Austria', 'Bangladesh', 'China', 'India', 'Korea', 'Mauritius', 'Norway', 'Pakistan', 'Qatar', 'Sri Lanka', 'Thailand']
const ALL_COUNTRIES = [...new Set([...ZERO_TAX, ...DTAA, 'Other'])].sort()

function ForeignMode() {
  const { t } = useApp()
  const [gross, setGross] = useState<number>(TAX_CONFIG.ui.defaults.gross)
  const [country, setCountry] = useState('Other')
  const [foreignTax, setForeignTax] = useState(0)
  const [filing, setFiling] = useState<'single' | 'couple'>('single')
  const [useCit, setUseCit] = useState(false)
  const [isFemale, setIsFemale] = useState(false)

  const isZero = ZERO_TAX.includes(country)
  const isDtaa = DTAA.includes(country)

  const opts: CalcOptions = {
    filingStatus: filing, includeSSF: false, includeCIT: useCit, citAmount: Infinity,
    lifeInsurance: 0, healthInsurance: 0, buildingInsurance: 0, donationAnnual: 0,
    remoteAreaGrade: 'none', hasDisability: false, isSeniorCitizen: false,
    isFemale, foreignTaxPaidAnnual: isZero ? 0 : foreignTax,
  }
  const result = useMemo(() => calculate(gross, opts), [gross, opts])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              <CardTitle>{t('foreign.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/15 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {t('foreign.info')}
              </p>
            </div>

            <label className="block">
              <span className="text-xs text-muted-foreground font-semibold">{t('foreign.gross')}</span>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-muted-foreground font-mono">₨</span>
                <input type="text" inputMode="numeric"
                  value={Math.round(gross).toLocaleString('en-IN')}
                  onChange={(e) => { const v = parseInt(e.target.value.replace(/\D/g, ''), 10); if (!isNaN(v)) setGross(v) }}
                  className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-lg font-mono font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <input type="range" min={TAX_CONFIG.ui.slider.min} max={TAX_CONFIG.ui.slider.max} step={TAX_CONFIG.ui.slider.step}
                value={Math.min(gross, TAX_CONFIG.ui.slider.max)} onChange={(e) => setGross(Number(e.target.value))}
                className="mt-2 w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
              />
            </label>

            <div>
              <label className="text-xs text-muted-foreground font-semibold block mb-1.5">{t('foreign.country')}</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {isDtaa && !isZero && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t('foreign.dtaa')}</p>}
            </div>

            {isZero && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={14} className="text-red-600 dark:text-red-400" />
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400">{t('foreign.zerotax')}</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-300">{country} {t('foreign.zerotax.desc')}</p>
              </div>
            )}

            {!isZero && (
              <label className="block">
                <span className="text-xs text-muted-foreground font-semibold">{t('foreign.taxpaid')}</span>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-muted-foreground font-mono">₨</span>
                  <input type="text" inputMode="numeric" value={foreignTax > 0 ? Math.round(foreignTax).toLocaleString('en-IN') : ''} placeholder="0"
                    onChange={(e) => { const v = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0; setForeignTax(v) }}
                    className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </label>
            )}

            <div className="flex gap-2">
              {(['single', 'couple'] as const).map((s) => (
                <button key={s} onClick={() => { setFiling(s); if (s === 'couple') setIsFemale(false) }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border ${filing === s ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground/70'}`}>
                  {t(s === 'single' ? 'filing.single' : 'filing.couple')}
                </button>
              ))}
            </div>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <span className="text-sm text-foreground">{t('cit.title')}</span>
                <span className="block text-xs text-muted-foreground">{t('foreign.voluntary')}</span>
              </div>
              <Switch checked={useCit} onCheckedChange={(v: boolean) => setUseCit(v)} />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <span className="text-sm text-foreground">{t('special.female')}</span>
                <span className="block text-xs text-muted-foreground">{t('special.female.desc')}</span>
                {filing === 'couple' && <span className="block text-xs text-amber-700 dark:text-amber-400">{t('special.female.denied')}</span>}
              </div>
              <Switch checked={isFemale} onCheckedChange={(v: boolean) => setIsFemale(v)} disabled={filing === 'couple'} />
            </label>
          </CardContent>
        </Card>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <StickyOutput result={result} />
      </div>
    </div>
  )
}

/* ─── Freelancer Mode (5% flat rate) ─────────────────────────────────── */

function FreelancerMode() {
  const { t } = useApp()
  const [gross, setGross] = useState<number>(TAX_CONFIG.ui.defaults.gross)
  const flatRate = TAX_CONFIG.freelancer.flatRate  // 5%
  const annual = gross * 12
  const tax = annual * flatRate
  const inhand = gross - tax / 12

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Laptop size={16} className="text-primary" />
            <CardTitle>{t('freelancer.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/15 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
              <p className="text-xs text-teal-700 dark:text-teal-300">
                {t('freelancer.info')}
              </p>
            </div>
          </div>
          <label className="block">
            <span className="text-xs text-muted-foreground font-semibold">{t('freelancer.gross')}</span>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="text-muted-foreground font-mono">₨</span>
              <input type="text" inputMode="numeric"
                value={Math.round(gross).toLocaleString('en-IN')}
                onChange={(e) => { const v = parseInt(e.target.value.replace(/\D/g, ''), 10); if (!isNaN(v)) setGross(v) }}
                className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-lg font-mono font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <input type="range" min={TAX_CONFIG.ui.slider.min} max={TAX_CONFIG.ui.slider.max} step={TAX_CONFIG.ui.slider.step}
              value={Math.min(gross, TAX_CONFIG.ui.slider.max)} onChange={(e) => setGross(Number(e.target.value))}
              className="mt-2 w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-center py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">{t('output.inhand')}</p>
          <div>
            <span className="text-muted-foreground text-2xl font-mono mr-1">₨</span>
            <AnimatedNumber value={inhand} format={(n) => Math.round(n).toLocaleString('en-IN')} className="text-4xl font-mono font-bold text-foreground" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">{t('common.monthly.tax')}</p>
              <p className="font-mono text-sm text-red-600 dark:text-red-400">{formatNPR(tax / 12)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.annual.tax')}</p>
              <p className="font-mono text-sm text-red-600 dark:text-red-400">{formatNPR(tax)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.effective.rate')}</p>
              <p className="font-mono text-sm text-primary">{formatPct(flatRate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Non-Resident Mode ──────────────────────────────────────────────── */

function NonResidentMode() {
  const { t } = useApp()
  const [gross, setGross] = useState<number>(TAX_CONFIG.ui.defaults.gross)
  const flatRate = 0.25
  const annual = gross * 12
  const tax = annual * flatRate
  const inhand = gross - tax / 12

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plane size={16} className="text-primary" />
            <CardTitle>{t('nonresident.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/15 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
              <div className="text-xs text-purple-700 dark:text-purple-300">
                <p>{t('nonresident.info1')}</p>
                <p className="mt-1">{t('nonresident.info2')}</p>
              </div>
            </div>
          </div>
          <label className="block">
            <span className="text-xs text-muted-foreground font-semibold">{t('nonresident.gross')}</span>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="text-muted-foreground font-mono">₨</span>
              <input type="text" inputMode="numeric"
                value={Math.round(gross).toLocaleString('en-IN')}
                onChange={(e) => { const v = parseInt(e.target.value.replace(/\D/g, ''), 10); if (!isNaN(v)) setGross(v) }}
                className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-lg font-mono font-bold text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <input type="range" min={TAX_CONFIG.ui.slider.min} max={TAX_CONFIG.ui.slider.max} step={TAX_CONFIG.ui.slider.step}
              value={Math.min(gross, TAX_CONFIG.ui.slider.max)} onChange={(e) => setGross(Number(e.target.value))}
              className="mt-2 w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-center py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">{t('output.inhand')}</p>
          <div>
            <span className="text-muted-foreground text-2xl font-mono mr-1">₨</span>
            <AnimatedNumber value={inhand} format={(n) => Math.round(n).toLocaleString('en-IN')} className="text-4xl font-mono font-bold text-foreground" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">{t('common.monthly.tax')} (25%)</p>
              <p className="font-mono text-sm text-red-600 dark:text-red-400">{formatNPR(tax / 12)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.annual.tax')}</p>
              <p className="font-mono text-sm text-red-600 dark:text-red-400">{formatNPR(tax)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.effective.rate')}</p>
              <p className="font-mono text-sm text-primary">{formatPct(flatRate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
