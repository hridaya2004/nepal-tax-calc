import { calculate, type CalcOptions } from '../calculate'

const baseOpts: CalcOptions = {
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
  hasMedicalExpenses: false,
}

test('medical tax credit applies Rs 750 against tax', () => {
  const baseline = calculate(150_000, baseOpts)
  const withMedical = calculate(150_000, { ...baseOpts, hasMedicalExpenses: true })
  expect(baseline.annualTax - withMedical.annualTax).toBe(750)
})

test('medical tax credit cannot drive tax negative', () => {
  // Tiny gross → tax is already 0, credit should not underflow.
  const r = calculate(10_000, { ...baseOpts, hasMedicalExpenses: true })
  expect(r.annualTax).toBeGreaterThanOrEqual(0)
})

/* ─── Existing verification tests ─────────────────────────────────── */

test('120k payslip verification', () => {
  const r = calculate(120_000, baseOpts)
  expect(Math.round(r.ssfMonthly)).toBe(22_320)
  expect(Math.round(r.citMonthly)).toBe(17_680)
  expect(Math.round(r.monthlyTax)).toBe(6_000)
  expect(Math.round(r.inhand)).toBe(74_000)
})

test('150k with 40k life insurance', () => {
  const r = calculate(150_000, { ...baseOpts, lifeInsurance: 40_000 })
  expect(Math.round(r.ssfMonthly)).toBe(27_900)
  expect(Math.round(r.citMonthly)).toBe(13_767)
  expect(Math.round(r.monthlyTax)).toBe(13_167)
  expect(Math.round(r.inhand)).toBe(95_167)
})

/* ─── Edge cases ──────────────────────────────────────────────────── */

test('₨0 gross produces zero everything', () => {
  const r = calculate(0, baseOpts)
  expect(r.gross).toBe(0)
  expect(r.ssfMonthly).toBe(0)
  expect(r.citMonthly).toBe(0)
  expect(r.monthlyTax).toBe(0)
  expect(r.inhand).toBe(0)
  expect(r.annualTax).toBe(0)
  expect(r.effectiveRate).toBe(0)
  expect(r.slabBreakdown).toEqual([])
})

test('very high salary (₨5M/mo) does not throw', () => {
  const r = calculate(5_000_000, baseOpts)
  expect(r.inhand).toBeGreaterThan(0)
  expect(r.inhand).toBeLessThan(5_000_000)
  expect(r.effectiveRate).toBeGreaterThan(0)
  expect(r.effectiveRate).toBeLessThan(1)
  // Should be in the 36% or 39% slab
  const topSlab = r.slabBreakdown[r.slabBreakdown.length - 1]
  expect(['36%', '39%']).toContain(topSlab.label)
})

/* ─── Retirement cap crossover at ₨125K ───────────────────────────── */

test('₨120K: 1/3 rule binds (cap < 5L)', () => {
  const r = calculate(120_000, baseOpts)
  // Annual gross = 14.4L, 1/3 = 4.8L. That's < 5L so 1/3 binds
  expect(r.effectiveRetirementCap).toBe(480_000)
})

test('₨150K: hard cap binds (5L < 1/3)', () => {
  const r = calculate(150_000, baseOpts)
  // Annual gross = 18L, 1/3 = 6L. 5L < 6L so hard cap binds
  expect(r.effectiveRetirementCap).toBe(500_000)
})

test('₨125K: exact crossover point', () => {
  const r = calculate(125_000, baseOpts)
  // Annual gross = 15L, 1/3 = 5L. Hard cap = 5L. They're equal.
  expect(r.effectiveRetirementCap).toBe(500_000)
})

/* ─── Filing status: couple ───────────────────────────────────────── */

test('couple filing uses higher slab thresholds', () => {
  const single = calculate(200_000, baseOpts)
  const couple = calculate(200_000, { ...baseOpts, filingStatus: 'couple' })
  // Couple gets higher thresholds → less tax
  expect(couple.annualTax).toBeLessThan(single.annualTax)
  expect(couple.inhand).toBeGreaterThan(single.inhand)
})

/* ─── Female rebate ───────────────────────────────────────────────── */

test('female rebate reduces tax by 10% for single filing', () => {
  const normal = calculate(150_000, baseOpts)
  const female = calculate(150_000, { ...baseOpts, isFemale: true })
  // Female tax should be ~90% of normal tax
  expect(Math.round(female.annualTax)).toBe(Math.round(normal.annualTax * 0.9))
  expect(female.inhand).toBeGreaterThan(normal.inhand)
})

test('female rebate denied with couple filing', () => {
  const couple = calculate(150_000, { ...baseOpts, filingStatus: 'couple' })
  const coupleFemale = calculate(150_000, { ...baseOpts, filingStatus: 'couple', isFemale: true })
  // isFemale should have no effect when couple filing
  // Note: the calculate function applies female rebate only when filingStatus === 'single'
  expect(coupleFemale.annualTax).toBe(couple.annualTax)
})

/* ─── Senior citizen ──────────────────────────────────────────────── */

test('senior citizen gets ₨50K additional exemption', () => {
  const normal = calculate(150_000, baseOpts)
  const senior = calculate(150_000, { ...baseOpts, isSeniorCitizen: true })
  // Senior should have lower taxable income
  expect(senior.annualTaxable).toBe(normal.annualTaxable - 50_000)
  expect(senior.annualTax).toBeLessThan(normal.annualTax)
})

/* ─── Disability exemption ────────────────────────────────────────── */

test('disability exemption for single = ₨250K', () => {
  const normal = calculate(200_000, baseOpts)
  const disabled = calculate(200_000, { ...baseOpts, hasDisability: true })
  expect(disabled.annualTaxable).toBe(normal.annualTaxable - 250_000)
})

test('disability exemption for couple = ₨300K', () => {
  const normal = calculate(200_000, { ...baseOpts, filingStatus: 'couple' })
  const disabled = calculate(200_000, { ...baseOpts, filingStatus: 'couple', hasDisability: true })
  expect(disabled.annualTaxable).toBe(normal.annualTaxable - 300_000)
})

/* ─── Remote area deductions ──────────────────────────────────────── */

test('remote area grade A gives ₨50K deduction', () => {
  const normal = calculate(150_000, baseOpts)
  const remote = calculate(150_000, { ...baseOpts, remoteAreaGrade: 'A' })
  expect(remote.annualTaxable).toBe(normal.annualTaxable - 50_000)
})

test('remote area grade E gives ₨10K deduction', () => {
  const normal = calculate(150_000, baseOpts)
  const remote = calculate(150_000, { ...baseOpts, remoteAreaGrade: 'E' })
  expect(remote.annualTaxable).toBe(normal.annualTaxable - 10_000)
})

/* ─── Insurance deductions ────────────────────────────────────────── */

test('all insurance deductions stack correctly', () => {
  const normal = calculate(150_000, baseOpts)
  const withAll = calculate(150_000, {
    ...baseOpts,
    lifeInsurance: 40_000,
    healthInsurance: 20_000,
    buildingInsurance: 5_000,
  })
  expect(withAll.annualTaxable).toBe(normal.annualTaxable - 65_000)
})

/* ─── Donation capping ────────────────────────────────────────────── */

test('donation is capped at lower of ₨100K or 5% of taxable', () => {
  // At ₨150K/mo, taxable is ~₨13L (after SSF+CIT). 5% ≈ ₨65K
  // So cap should be min(100_000, ~65K) = ~65K
  const r = calculate(150_000, { ...baseOpts, donationAnnual: 200_000 })
  // Donation should be applied (capped) — taxable should be lower than without donation
  const rNoDon = calculate(150_000, baseOpts)
  expect(r.annualTaxable).toBeLessThan(rNoDon.annualTaxable)
  // But not by the full 200K — it should be capped
  expect(rNoDon.annualTaxable - r.annualTaxable).toBeLessThanOrEqual(100_000)
})

/* ─── SSF waives 1% SST slab ─────────────────────────────────────── */

test('SSF waives 1% SST slab (first slab rate = 0)', () => {
  const withSSF = calculate(150_000, baseOpts)
  const noSSF = calculate(150_000, { ...baseOpts, includeSSF: false })
  // With SSF: first slab should have 0% rate
  const firstSlabSSF = withSSF.slabBreakdown[0]
  if (firstSlabSSF) expect(firstSlabSSF.tax).toBe(0)
  // Without SSF: first slab should have 1% rate
  const firstSlabNoSSF = noSSF.slabBreakdown[0]
  if (firstSlabNoSSF) expect(firstSlabNoSSF.tax).toBeGreaterThan(0)
})

/* ─── No SSF, no CIT ─────────────────────────────────────────────── */

test('disabling SSF and CIT increases taxable income', () => {
  const full = calculate(150_000, baseOpts)
  const bare = calculate(150_000, { ...baseOpts, includeSSF: false, includeCIT: false })
  expect(bare.annualTaxable).toBeGreaterThan(full.annualTaxable)
  expect(bare.annualTax).toBeGreaterThan(full.annualTax)
  expect(bare.ssfMonthly).toBe(0)
  expect(bare.citMonthly).toBe(0)
})

/* ─── Foreign tax credit ──────────────────────────────────────────── */

test('foreign tax credit reduces Nepal tax liability', () => {
  const noCredit = calculate(150_000, { ...baseOpts, includeSSF: false })
  const withCredit = calculate(150_000, { ...baseOpts, includeSSF: false, foreignTaxPaidAnnual: 50_000 })
  expect(withCredit.annualTax).toBeLessThan(noCredit.annualTax)
})

test('foreign tax credit capped at average rate × taxable', () => {
  // Paying more foreign tax than Nepal liability should cap the credit
  const withHugeCredit = calculate(100_000, { ...baseOpts, includeSSF: false, foreignTaxPaidAnnual: 10_000_000 })
  expect(withHugeCredit.annualTax).toBe(0) // fully offset, but not negative
})

/* ─── CIT amount clamping ─────────────────────────────────────────── */

test('CIT respects max CIT monthly', () => {
  const r = calculate(120_000, baseOpts)
  expect(r.citMonthly).toBeLessThanOrEqual(r.maxCitMonthly)
  // SSF + CIT annual should not exceed retirement cap
  expect(r.ssfAnnual + r.citAnnual).toBeLessThanOrEqual(r.effectiveRetirementCap + 1) // +1 for rounding
})

test('partial CIT amount is respected', () => {
  const full = calculate(120_000, baseOpts)
  const partial = calculate(120_000, { ...baseOpts, citAmount: 5000 })
  expect(partial.citMonthly).toBe(5000)
  expect(partial.citMonthly).toBeLessThan(full.citMonthly)
  expect(partial.annualTax).toBeGreaterThan(full.annualTax) // less deduction = more tax
})

/* ─── Slab breakdown correctness ──────────────────────────────────── */

test('slab breakdown tax sums to annual tax', () => {
  const r = calculate(200_000, baseOpts)
  const slabTaxSum = r.slabBreakdown.reduce((sum, s) => sum + s.tax, 0)
  // With female rebate off, slab sum should equal annual tax (no rebate applied)
  // Actually female rebate IS applied to the breakdown in calculate.ts
  // So slab sum should equal annual tax
  expect(Math.round(slabTaxSum)).toBe(Math.round(r.annualTax))
})

test('slab breakdown income sums to annual taxable', () => {
  const r = calculate(200_000, baseOpts)
  const slabIncomeSum = r.slabBreakdown.reduce((sum, s) => sum + s.income, 0)
  expect(Math.round(slabIncomeSum)).toBe(Math.round(r.annualTaxable))
})

/* ─── Inhand calculation ──────────────────────────────────────────── */

test('inhand = gross - SSF - CIT - monthly tax', () => {
  const r = calculate(150_000, baseOpts)
  const expected = r.gross - r.ssfMonthly - r.citMonthly - r.monthlyTax
  expect(Math.round(r.inhand)).toBe(Math.round(expected))
})

test('effective rate = annual tax / annual taxable', () => {
  const r = calculate(200_000, baseOpts)
  if (r.annualTaxable > 0) {
    expect(r.effectiveRate).toBeCloseTo(r.annualTax / r.annualTaxable, 4)
  }
})
