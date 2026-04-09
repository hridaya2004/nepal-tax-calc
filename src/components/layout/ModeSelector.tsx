"use client"

import { motion } from 'framer-motion'
import { Briefcase, Globe, Laptop, Plane } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { TranslationKey } from '@/config/i18n'

export type IncomeMode = 'nepal' | 'foreign' | 'freelancer' | 'nonresident'

const modes: { id: IncomeMode; label: TranslationKey; short: TranslationKey; icon: typeof Briefcase }[] = [
  { id: 'nepal',       label: 'mode.nepal',       short: 'mode.nepal.short',       icon: Briefcase },
  { id: 'foreign',     label: 'mode.foreign',     short: 'mode.foreign.short',     icon: Globe },
  { id: 'freelancer',  label: 'mode.freelancer',  short: 'mode.freelancer.short',  icon: Laptop },
  { id: 'nonresident', label: 'mode.nonresident',  short: 'mode.nonresident.short', icon: Plane },
]

interface Props {
  value: IncomeMode
  onChange: (mode: IncomeMode) => void
}

export function ModeSelector({ value, onChange }: Props) {
  const { t } = useApp()

  return (
    <nav aria-label="Income mode" className="flex bg-secondary/70 rounded-xl p-1 gap-0.5 border border-border/40" role="tablist">
      {modes.map((m) => {
        const Icon = m.icon
        const active = value === m.id
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.id)}
            className={`relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
            }`}
          >
            {active && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 bg-card rounded-lg ledger-shadow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon size={14} aria-hidden="true" />
              <span className="hidden sm:inline">{t(m.label)}</span>
              <span className="sm:hidden">{t(m.short)}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
