export const DISCOUNT_TYPES = {
  PERCENT: "percent",
  NOMINAL: "fixed",
} as const

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES]

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  percent: "Persentase",
  fixed: "Nominal",
}