// Indian number system: 1,50,000 not 150,000
export function formatNPR(n: number): string {
  return '₨ ' + Math.round(n).toLocaleString('en-IN')
}

export function formatPct(n: number, decimals = 1): string {
  return (n * 100).toFixed(decimals) + '%'
}

export function formatDiff(n: number): string {
  return (n >= 0 ? '+' : '') + formatNPR(n)
}
