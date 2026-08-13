import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as Partial<T>
}

export function buildListParams<T extends Record<string, unknown>>(
  defaults: { page: number; limit: number },
  filters: T
) {
  return stripEmpty({ ...defaults, ...filters })
}

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