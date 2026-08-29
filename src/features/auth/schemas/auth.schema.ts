import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token tidak valid"),
    newPassword: z
      .string()
      .min(1, "Kata sandi baru wajib diisi")
      .min(6, "Kata sandi minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  })

export type LoginRequest = z.infer<typeof loginSchema>

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ResetPasswordRequest = Pick<ResetPasswordFormValues, "token" | "newPassword">