import { Role } from "@/features/roles/types/role";

export interface JwtPayload {
  user_id: string;
  role: string;
  exp: number;
  iat: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  type: "menu" | "action";
  path: string | null;
  children: Permission[] | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  permissions: Permission[];
}

export interface RefreshResponse {
  accessToken: string;
}