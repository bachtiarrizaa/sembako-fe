import { z } from "zod"

export const productSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
  category_id: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
  include: z.string().optional(),
})

export type ProductSearch = z.infer<typeof productSearchSchema>

export const updateProductStatusRequest = z.object({
  isActive: z.boolean()
})

export type UpdateProductStatusRequest = z.infer<typeof updateProductStatusRequest>

// Product unit schema for creating/updating a product
export const productFormUnitSchema = z.object({
  id: z.string().optional(),
  unitId: z.string().min(1, "Satuan wajib dipilih"),
  conversionToBase: z.coerce.number().min(0.0001, "Konversi minimal > 0"),
  sellingPrice: z.coerce.number().min(0, "Harga jual minimal 0"),
  isBaseUnit: z.boolean(),
  isActive: z.boolean().optional(),
})

export type ProductFormUnit = z.infer<typeof productFormUnitSchema>

// Schema to create a product
export const createProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(100, "Maksimal 100 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  minimumStock: z.coerce.number().min(0, "Stok minimal minimal 0").optional(),
  marginThresholdPercent: z.coerce.number().min(0, "Margin threshold minimal 0").optional(),
  image: z.any().optional(), // File instance
  units: z.array(productFormUnitSchema).min(1, "Minimal harus ada 1 satuan"),
}).refine((data) => {
  const baseUnits = data.units.filter((u) => u.isBaseUnit)
  return baseUnits.length === 1
}, {
  message: "Harus ada tepat satu Base Unit",
  path: ["units"],
})

export type CreateProductRequest = z.infer<typeof createProductSchema>

// Schema to update product info (including units sync)
export const updateProductSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(100, "Maksimal 100 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  minimumStock: z.coerce.number().min(0, "Stok minimal minimal 0").optional(),
  marginThresholdPercent: z.coerce.number().min(0, "Margin threshold minimal 0").optional(),
  image: z.any().optional(),
  units: z.array(productFormUnitSchema).min(1, "Minimal harus ada 1 satuan"),
}).refine((data) => {
  const baseUnits = data.units.filter((u) => u.isBaseUnit)
  return baseUnits.length === 1
}, {
  message: "Harus ada tepat satu Base Unit",
  path: ["units"],
})

export type UpdateProductRequest = z.infer<typeof updateProductSchema>

// Schema to add product unit
export const addProductUnitSchema = z.object({
  unitId: z.string().min(1, "Satuan wajib dipilih"),
  conversionToBase: z.coerce.number().min(0.0001, "Konversi minimal > 0"),
  sellingPrice: z.coerce.number().min(0, "Harga jual minimal 0"),
})

export type AddProductUnitRequest = z.infer<typeof addProductUnitSchema>

// Schema to update product unit
export const updateProductUnitSchema = z.object({
  conversionToBase: z.coerce.number().min(0.0001, "Konversi minimal > 0"),
  sellingPrice: z.coerce.number().min(0, "Harga jual minimal 0"),
})

export type UpdateProductUnitRequest = z.infer<typeof updateProductUnitSchema>
