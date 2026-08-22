"use client"

import { useUserMe } from "../hooks/useUserMe"
import { Spinner } from "@/components/ui/spinner"
import { XCircle } from "lucide-react"
import { ProfileIdentityCard } from "./ProfileIdentityCard"
import { ProfileDetailsCard } from "./ProfileDetailsCard"

export function ProfilePage() {
  const { data: userResponse, isLoading, isError } = useUserMe()
  const user = userResponse?.data

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-3">
          <XCircle className="size-12 text-destructive mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Gagal Memuat Profil</h3>
          <p className="text-sm text-muted-foreground">Silakan segarkan halaman atau coba lagi nanti.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Profil Saya</h1>
        <p className="text-sm text-slate-500">Kelola detail informasi akun personal Anda di sistem secara langsung.</p>
      </div>

      {/* Split Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Identity card (col-span-4) */}
        <div className="md:col-span-4">
          <ProfileIdentityCard user={user} />
        </div>

        {/* RIGHT COLUMN: Detailed Information Grid (col-span-8) */}
        <div className="md:col-span-8">
          <ProfileDetailsCard user={user} />
        </div>
      </div>
    </div>
  )
}
