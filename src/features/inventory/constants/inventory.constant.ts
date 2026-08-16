export const MUTATION_TYPES = {
  IN: "in",
  OUT: "out",
} as const

export type MutationType = (typeof MUTATION_TYPES)[keyof typeof MUTATION_TYPES]

export const MUTATION_TYPE_LABELS: Record<MutationType, string> = {
  in: "Masuk",
  out: "Keluar",
}

export const MUTATION_SOURCES = {
  PURCHASE: "purchase",
  STOCK_COUNT: "stock_count",
  SALE: "sale",
  POS: "pos",
  VOID: "void",
} as const

export type MutationSource = (typeof MUTATION_SOURCES)[keyof typeof MUTATION_SOURCES]

export const MUTATION_SOURCE_LABELS: Record<MutationSource, string> = {
  purchase: "Pembelian",
  stock_count: "Opname Stok",
  sale: "Penjualan (POS)",
  pos: "Penjualan (POS)",
  void: "Void Transaksi",
}

export const OPNAME_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const

export type OpnameStatus = (typeof OPNAME_STATUSES)[keyof typeof OPNAME_STATUSES]

export const OPNAME_STATUS_LABELS: Record<OpnameStatus, string> = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak",
}
