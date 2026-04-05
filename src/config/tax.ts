export const TAX_CONFIG = {
  salary: {
    basicRatio: 0.60,
    // NOTE: 60% is common employer practice, NOT a statutory requirement.
    // Employers define basic in their own salary structure.
  },

  freelancer: {
    flatRate: 0.05,   // 5% withheld by bank on foreign currency transfer
  },

  ssf: {
    employeeRate: 0.11,
    employerRate: 0.20,
    totalRate: 0.31,          // of basic salary
    // IMPORTANT: Full 31% reduces take-home in CTC model (not just 11%)
    // Contributing to SSF waives the 1% Social Security Tax on first slab
    waivesSocialSecurityTax: true,
  },

  retirementCap: {
    // Total retirement deduction (SSF + CIT combined) =
    // min(₨5,00,000/year, 1/3 of annual gross) — whichever is LOWER
    // At 120k/mo: min(5L, 4.8L) = 4.8L  → 1/3 rule binds
    // At 150k/mo: min(5L, 6.0L) = 5.0L  → hard cap binds
    // Crossover point: ₨1,25,000/month gross
    absoluteMax: 500_000,
    ratioMax: 1 / 3,
  },

  taxSlabs: {
    single: [
      { upTo: 500_000,   rate: 0.01, label: '1% SST'  },
      { upTo: 700_000,   rate: 0.10, label: '10%'      },
      { upTo: 1_000_000, rate: 0.20, label: '20%'      },
      { upTo: 2_000_000, rate: 0.30, label: '30%'      },
      { upTo: 5_000_000, rate: 0.36, label: '36%'      },
      { upTo: Infinity,  rate: 0.39, label: '39%'      },
    ],
    couple: [
      { upTo: 600_000,   rate: 0.01, label: '1% SST'  },
      { upTo: 800_000,   rate: 0.10, label: '10%'      },
      { upTo: 1_100_000, rate: 0.20, label: '20%'      },
      { upTo: 2_100_000, rate: 0.30, label: '30%'      },
      { upTo: 5_100_000, rate: 0.36, label: '36%'      },
      { upTo: Infinity,  rate: 0.39, label: '39%'      },
    ],
  },

  deductions: {
    lifeInsurance:     { max: 40_000 },
    healthInsurance:   { max: 20_000 },
    buildingInsurance: { max: 5_000  },
    donation: {
      maxAbsolute: 100_000,
      maxPctOfTaxable: 0.05,
    },
    remoteArea: {
      A: 50_000, B: 40_000, C: 30_000, D: 20_000, E: 10_000, none: 0,
    } as Record<string, number>,
  },

  specialExemptions: {
    disability: { single: 250_000, couple: 300_000 },
    seniorCitizen: { additional: 50_000 },
  },

  rebates: {
    female: { rate: 0.10 },
    medicalTaxCredit: { max: 750 },
  },

  ui: {
    slider: { min: 0, max: 5_000_000, step: 5_000 },
    defaults: { gross: 150_000, currentGross: 120_000 },
    verdicts: [
      { minPct: 0,    maxPct: 0.10, label: 'Minimal',              color: 'slate'  },
      { minPct: 0.10, maxPct: 0.20, label: 'Decent',               color: 'blue'   },
      { minPct: 0.20, maxPct: 0.30, label: 'Good ask',             color: 'green'  },
      { minPct: 0.30, maxPct: 0.40, label: 'Ambitious',            color: 'amber'  },
      { minPct: 0.40, maxPct: Infinity, label: 'Job-switch territory', color: 'red' },
    ],
  },
} as const

export type FilingStatus = 'single' | 'couple'
export type RemoteGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'none'
