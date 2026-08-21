export function formatDate(value?: string | null, fallback = "-"): string {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(value?: string | null, fallback = "-"): string {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatShortDateTime(value?: string | null, fallback = "-"): string {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  const datePart = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
  const timePart = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
  return `${datePart} / ${timePart}`
}

export function formatCurrency(
  value?: string | number | null,
  fallback = "-"
): string {
  if (value === undefined || value === null || value === "") return fallback
  const number = typeof value === "string" ? Number(value) : value
  if (Number.isNaN(number)) return fallback
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number)
}

export function formatQuantity(value?: number | null, unit?: { name: string } | null): string {
  const qty = value ?? 0
  return unit?.name ? `${qty} ${unit.name}` : String(qty)
}

export function resolveStaticUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith("http")) return path
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  const staticBaseUrl = baseUrl.replace(/\/api\/?$/, "")
  return `${staticBaseUrl}${path}`
}

export function formatPurchasedQuantity(
  baseQuantity?: number | null,
  opts?: {
    unit?: { name: string } | null
    unitPrice?: number | null
    purchasePrice?: number
    baseUnit?: { name: string } | null
  } | null,
  compact = false
): string {
  const qty = baseQuantity ?? 0
  const unit = opts?.unit
  const unitPrice = opts?.unitPrice
  const purchasePrice = opts?.purchasePrice
  const baseUnit = opts?.baseUnit

  const conversion =
    unit && unitPrice != null && purchasePrice != null && purchasePrice > 0
      ? unitPrice / purchasePrice
      : null

  if (unit && conversion && conversion > 0) {
    const converted = Math.round((qty / conversion) * 100) / 100
    if (compact) return `${converted} ${unit.name}`
    return baseUnit?.name
      ? `${converted} ${unit.name} (${qty} ${baseUnit.name})`
      : `${converted} ${unit.name}`
  }
  return baseUnit?.name ? `${qty} ${baseUnit.name}` : String(qty)
}

export function purchasedQuantityInUnit(
  baseQuantity?: number | null,
  opts?: {
    unit?: { name: string } | null
    unitPrice?: number | null
    purchasePrice?: number
  } | null
): number {
  const qty = baseQuantity ?? 0
  const unit = opts?.unit
  const unitPrice = opts?.unitPrice
  const purchasePrice = opts?.purchasePrice

  const conversion =
    unit && unitPrice != null && purchasePrice != null && purchasePrice > 0
      ? unitPrice / purchasePrice
      : null

  if (unit && conversion && conversion > 0) {
    return Math.round((qty / conversion) * 100) / 100
  }
  return qty
}

export function formatStartDate(date: Date): string {
  return `${toDateOnly(date)}T00:00:00Z`
}

export function formatEndDate(date: Date): string {
  return `${toDateOnly(date)}T23:59:59Z`
}

function toDateOnly(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function formatDateToYYYYMMDD(dateStr?: string | null): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ""
  return toDateOnly(date)
}
