import { calculate } from '../calculate'

const baseOpts = {
  filingStatus: 'single' as const,
  includeSSF: true,
  includeCIT: true,
  citAmount: Infinity,   // use max
  lifeInsurance: 0,
  healthInsurance: 0,
  buildingInsurance: 0,
  donationAnnual: 0,
  remoteAreaGrade: 'none' as const,
  hasDisability: false,
  isSeniorCitizen: false,
  isFemale: false,
  foreignTaxPaidAnnual: 0,
}

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
