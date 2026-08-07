import { Role } from "@/features/roles/types/role"

export interface UserResponse {
  id: string
  name: string
  email: string
  username: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}