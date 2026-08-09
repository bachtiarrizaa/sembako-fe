import type { Role } from "@/features/roles/types/role"

interface UserBase {
  id: string
  name: string
  email: string
  username: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User extends UserBase {
  roleId: string
}

export interface UserResponse extends UserBase {
  role: Pick<Role, "id" | "name">
}