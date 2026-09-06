/**
 * Utility Fungsi Format Tanggal, Waktu, & Angka (Global & Konsisten)
 * 
 * Sesuai Kesepakatan 3 Standard Utama:
 * 1. formatDate(val)      -> "06 September 2026" (Full Date)
 * 2. formatFullDate(val)  -> "Minggu, 06 September 2026" (Full Date + Hari)
 * 3. formatDateTime(val)  -> "06 September 2026, 14:31" (Full Date + Jam)
 */

/** Helper internal untuk parse string/Date secara aman */
function parseDate(value?: string | Date | null): Date | null {
  if (!value) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  const str = String(value).trim()
  if (!str) return null
  const normalized = str.includes(" ") && !str.includes("T") ? str.replace(" ", "T") : str
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Standard 1: "06 September 2026" (Full Date) */
export function formatDate(value?: string | Date | null, fallback = "-"): string {
  const date = parseDate(value)
  if (!date) return fallback
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

/** Standard 2: "Minggu, 06 September 2026" (Full Date + Hari) */
export function formatFullDate(value?: Date | string | null, fallback = "-"): string {
  const date = parseDate(value)
  if (!date) return fallback
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

/** Standard 3: "06 September 2026, 14:31" (Full Date + Jam) */
export function formatDateTime(value?: string | Date | null, fallback = "-"): string {
  const date = parseDate(value)
  if (!date) return fallback
  const datePart = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
  const timePart = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replace(/\./g, ":")
  return `${datePart}, ${timePart}`
}

/** Format: "14:31:09 WIB" (Hanya Waktu Jam:Menit:Detik) */
export function formatTimeOnly(value?: Date | string | null, fallback = "--:--:-- WIB"): string {
  const date = parseDate(value)
  if (!date) return fallback
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date).replace(/\./g, ":")
  return `${timeStr} WIB`
}

/** Alias/Kompatibilitas: Menggunakan Standard 1 (formatDate: "06 September 2026") */
export const formatShortDate = formatDate

/** Alias/Kompatibilitas: Menggunakan Standard 3 (formatDateTime: "06 September 2026, 14:31") */
export const formatShortDateTime = formatDateTime
export const formatTransactionDate = formatDateTime

/** Format Mata Uang: "Rp 10.000" */
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

/** Alias export untuk kompatibilitas */
export const formatPurchasedQuantityInUnit = purchasedQuantityInUnit

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

export function formatDateToYYYYMMDD(dateStr?: string | Date | null): string {
  if (!dateStr) return ""
  const date = parseDate(dateStr)
  if (!date) return ""
  return toDateOnly(date)
}
