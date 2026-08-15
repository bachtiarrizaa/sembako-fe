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
