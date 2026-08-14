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
