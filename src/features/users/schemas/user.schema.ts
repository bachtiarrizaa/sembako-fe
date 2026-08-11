import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(25, "Maksimal 25 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20, "Maksimal 20 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  roleId: z.string().min(1, "Role wajib dipilih"),
})

export type CreateUserRequest = z.infer<typeof userSchema>

export const updateUserSchema = userSchema.omit({ password: true })

export type UpdateUserRequest = z.infer<typeof updateUserSchema>

export type UserFormValues = Omit<CreateUserRequest, "password"> & { password?: string }

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
})

export type UpdateUserStatusRequest = z.infer<typeof updateUserStatusSchema>

export const userSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  limit: z.coerce.number().catch(10),
  search: z.string().optional(),
})

export type UserSearch = z.infer<typeof userSearchSchema>