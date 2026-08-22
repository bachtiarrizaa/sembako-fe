"use client"

import { useRef } from "react"
import { Shield, CheckCircle2, XCircle, UserCheck, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { formatDate, resolveStaticUrl } from "@/utils/format"
import { toast } from "@/components/ui/toast"
import { useUpdateProfile } from "../hooks/useUpdateProfile"
import { UserResponse } from "../types/user"

interface ProfileIdentityCardProps {
  user: UserResponse
}

export function ProfileIdentityCard({ user }: ProfileIdentityCardProps) {
  const updateProfile = useUpdateProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const roleName = user.role?.name || "staff"
  const isAdmin = roleName.toLowerCase() === "admin"

  // Get initial letters of the name for avatar
  const avatarInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U"

  // Immediate upload for profile image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.add({
          title: "Ukuran gambar maksimal 2MB",
          type: "error",
        })
        return
      }
      const formData = new FormData()
      formData.append("image", file)
      
      // Submit name and username along to keep data consistent
      formData.append("name", user.name)
      formData.append("username", user.username)

      updateProfile.mutate(formData)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200/80 shadow-sm bg-white overflow-hidden">
        {/* Soft decorative header gradient banner */}
        <div className="h-24 bg-gradient-to-br from-teal-500 to-teal-600 w-full" />
        
        <CardContent className="pt-0 px-6 pb-6 relative flex flex-col items-center text-center">
          {/* Profile Avatar Container with camera trigger */}
          <div className="relative -mt-12 mb-4 group">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              disabled={updateProfile.isPending}
            />
            
            <div className="w-24 h-24 rounded-full border-4 border-white bg-teal-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-md overflow-hidden relative select-none">
              {updateProfile.isPending ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Spinner className="size-5 text-white" />
                </div>
              ) : null}

              {user.image ? (
                <img 
                  src={resolveStaticUrl(user.image) || ""} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                avatarInitials
              )}
            </div>

            {/* Overlap camera edit button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={updateProfile.isPending}
              className="absolute bottom-0 right-0 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full border-2 border-white shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Ganti Foto Profil"
            >
              <Camera className="size-3.5" />
            </button>
          </div>

          {/* Display Name */}
          <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">
            {user.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">@{user.username}</p>

          <hr className="border-slate-100 w-full my-4" />

          {/* Status and Roles badges */}
          <div className="flex flex-col gap-2.5 w-full">
            <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium">Peran / Role</span>
              <Badge 
                variant="secondary"
                className={`text-[10px] font-bold px-2 py-0.5 capitalize border select-none ${
                  isAdmin 
                    ? "bg-blue-50 text-blue-700 border-blue-200/60" 
                    : "bg-amber-50 text-amber-700 border-amber-200/60"
                }`}
              >
                <Shield className="size-3 mr-1" strokeWidth={2.5} />
                {roleName}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium">Status Akun</span>
              <Badge
                variant="secondary"
                className={`text-[10px] font-bold px-2 py-0.5 border select-none ${
                  user.isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                    : "bg-rose-50 text-rose-700 border-rose-200/60"
                }`}
              >
                {user.isActive ? (
                  <>
                    <CheckCircle2 className="size-3 mr-1 text-emerald-600" strokeWidth={2.5} />
                    Aktif
                  </>
                ) : (
                  <>
                    <XCircle className="size-3 mr-1 text-rose-600" strokeWidth={2.5} />
                    Nonaktif
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Stats Widget */}
      <Card className="border border-slate-200/80 shadow-sm bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg border border-teal-100">
            <UserCheck className="size-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Anggota Sejak</p>
            <p className="text-xs font-semibold text-slate-700 mt-1">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
