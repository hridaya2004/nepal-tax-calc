import type { FilingStatus, RemoteGrade } from '@/config/tax'
import { TAX_CONFIG } from '@/config/tax'

export interface CalcOptions {
  filingStatus: FilingStatus
  includeSSF: boolean
  includeCIT: boolean
  citAmount: number           // monthly; 0 to maxCitMonthly
  lifeInsurance: number       // annual
  healthInsurance: number     // annual
  buildingInsurance: number   // annual
  donationAnnual: number
  remoteAreaGrade: RemoteGrade
  hasDisability: boolean
  isSeniorCitizen: boolean
  isFemale: boolean
  foreignTaxPaidAnnual: number
}

export interface CalcResult {
  gross: number
  basic: number
  ssfMonthly: number
  ssfAnnual: number
  citMonthly: number
  citAnnual: number
  maxCitMonthly: number
  effectiveRetirementCap: number
  annualTaxable: number
  annualTax: number
  monthlyTax: number
  inhand: number
  effectiveRate: number
  retirementTotal: number
  slabBreakdown: SlabBreakdown[]
}

export interface SlabBreakdown {
  label: string
  rate: number
  income: number
  tax: number
}

function calcSlabTax(
  taxable: number,
  slabs: readonly { readonly upTo: number; readonly rate: number; readonly label: string }[]
): { total: number; breakdown: SlabBreakdown[] } {
  let tax = 0
  let remaining = Math.max(0, taxable)
  let prev = 0
  const breakdown: SlabBreakdown[] = []

  for (const slab of slabs) {
    const band = Math.min(remaining, slab.upTo - prev)
    const bandTax = band * slab.rate
    if (band > 0) {
      breakdown.push({ label: slab.label, rate: slab.rate, income: band, tax: bandTax })
    }
    tax += bandTax
    remaining -= band
    prev = slab.upTo
    if (remaining <= 0) break
  }

  return { total: tax, breakdown }
}

export function calculate(gross: number, opts: CalcOptions): CalcResult {
  const annualGross = gross * 12
  const basic = gross * TAX_CONFIG.salary.basicRatio

  // SSF
  const ssfMonthly = opts.includeSSF ? basic * TAX_CONFIG.ssf.totalRate : 0
  const ssfAnnual = ssfMonthly * 12

  // Retirement cap: min(5L, 1/3 of annual gross)
  const effectiveRetirementCap = Math.min(
    TAX_CONFIG.retirementCap.absoluteMax,
    annualGross * TAX_CONFIG.retirementCap.ratioMax
  )
  const maxCitAnnual = Math.max(0, effectiveRetirementCap - ssfAnnual)
  const maxCitMonthly = maxCitAnnual / 12

  // CIT: use provided amount clamped to max, or 0 if CIT disabled
  const citMonthly = opts.includeCIT ? Math.min(opts.citAmount, maxCitMonthly) : 0
  const citAnnual = citMonthly * 12

  // Special exemptions
  const remoteBonus = TAX_CONFIG.deductions.remoteArea[opts.remoteAreaGrade]
  const disabilityBonus = opts.hasDisability
    ? TAX_CONFIG.specialExemptions.disability[opts.filingStatus] : 0
  const seniorBonus = opts.isSeniorCitizen
    ? TAX_CONFIG.specialExemptions.seniorCitizen.additional : 0

  // Taxable income (before donation, to calculate donation cap)
  const preDonation = annualGross - ssfAnnual - citAnnual
    - opts.lifeInsurance - opts.healthInsurance - opts.buildingInsurance
    - remoteBonus - disabilityBonus - seniorBonus

  const maxDonation = Math.min(
    TAX_CONFIG.deductions.donation.maxAbsolute,
    preDonation * TAX_CONFIG.deductions.donation.maxPctOfTaxable
  )
  const donation = Math.min(opts.donationAnnual, Math.max(0, maxDonation))
  const annualTaxable = Math.max(0, preDonation - donation)

  // Slabs — zero out SST band if SSF active
  const rawSlabs = TAX_CONFIG.taxSlabs[opts.filingStatus]
  const slabs = rawSlabs.map((s, i) =>
    i === 0 && opts.includeSSF ? { ...s, rate: 0 as const } : s
  )

  let { total: annualTax, breakdown } = calcSlabTax(annualTaxable, slabs)

  // Female rebate (single filing + Nepal employment only)
  if (opts.isFemale && opts.filingStatus === 'single') {
    annualTax = annualTax * (1 - TAX_CONFIG.rebates.female.rate)
    breakdown = breakdown.map(b => ({ ...b, tax: b.tax * 0.9 }))
  }

  // Foreign tax credit
  const avgRate = annualTaxable > 0 ? annualTax / annualTaxable : 0
  const credit = Math.min(opts.foreignTaxPaidAnnual, annualTaxable * avgRate)
  annualTax = Math.max(0, annualTax - credit)

  const monthlyTax = annualTax / 12
  const inhand = gross - ssfMonthly - citMonthly - monthlyTax

  return {
    gross, basic, ssfMonthly, ssfAnnual, citMonthly, citAnnual,
    maxCitMonthly, effectiveRetirementCap,
    annualTaxable, annualTax, monthlyTax, inhand,
    effectiveRate: annualTaxable > 0 ? annualTax / annualTaxable : 0,
    retirementTotal: ssfMonthly + citMonthly,
    slabBreakdown: breakdown,
  }
}
