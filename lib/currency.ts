export function formatMK(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "MK0"
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return "MK0"
  return "MK" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const CURRENCY_SYMBOL = "MK"
