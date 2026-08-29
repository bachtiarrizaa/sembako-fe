"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Mail, Calendar, Key, FileText, Clock, Pencil, X, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/utils/format"
import { updateProfileSchema, UpdateProfileRequest } from "../schemas/user.schema"
import { useUpdateProfile } from "../hooks/useUpdateProfile"
import { UserResponse } from "../types/user"

interface ProfileDetailsCardProps {
  user: UserResponse
}

export function ProfileDetailsCard({ user }: ProfileDetailsCardProps) {
  const updateProfile = useUpdateProfile()
  const [isEditingFields, setIsEditingFields] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      username: "",
    },
  })

  // Prefill form values once user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
      })
    }
  }, [user, reset])

  const onFieldsSubmit = (values: UpdateProfileRequest) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("username", values.username)

    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditingFields(false)
      },
    })
  }

  const handleCancelEdit = () => {
    reset({
      name: user.name,
      username: user.username,
    })
    setIsEditingFields(false)
  }

  return (
    <Card className="border border-slate-200/80 shadow-sm bg-white">
      <CardContent className="p-6 space-y-5">
        <form onSubmit={handleSubmit(onFieldsSubmit)} noValidate>
          <div className="space-y-5">
            
            {/* Subsection 1: Personal Info */}
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="size-3.5 text-teal-600" />
                  Informasi Personal
                </h3>
                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  {isEditingFields ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={updateProfile.isPending}
                        className="h-7 text-xs font-semibold px-2 cursor-pointer gap-1"
                      >
                        <X className="size-3" /> Batal
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSubmit(onFieldsSubmit)}
                        disabled={updateProfile.isPending || !isDirty}
                        className="h-7 text-xs font-semibold px-2.5 cursor-pointer gap-1"
                      >
                        {updateProfile.isPending ? (
                          <Spinner className="size-3" />
                        ) : (
                          <>
                            <Check className="size-3" /> Simpan
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsEditingFields(true)}
                      className="h-7 text-xs font-semibold px-2.5 cursor-pointer gap-1"
                    >
                      <Pencil className="size-3" /> Ubah
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="space-y-1">
                  <label htmlFor="profile-name-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                  {isEditingFields ? (
                    <div>
                      <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                        <InputGroupAddon align="inline-start">
                          <User className="size-3.5 text-slate-400 shrink-0" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="profile-name-input"
                          className="font-semibold text-slate-700 h-8"
                          disabled={updateProfile.isPending}
                          {...register("name")}
                        />
                      </InputGroup>
                      {errors.name && (
                        <span className="text-[11px] text-destructive leading-none mt-1 block">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
                      <User className="size-3.5 text-slate-400 shrink-0" />
                      {user.name}
                    </div>
                  )}
                </div>

                {/* Username Field */}
                <div className="space-y-1">
                  <label htmlFor="profile-username-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Username</label>
                  {isEditingFields ? (
                    <div>
                      <InputGroup className="bg-white border-slate-200 h-9 font-semibold text-slate-700">
                        <InputGroupAddon align="inline-start">
                          <Key className="size-3.5 text-slate-400 shrink-0" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="profile-username-input"
                          className="font-semibold text-slate-700 h-8"
                          disabled={updateProfile.isPending}
                          {...register("username")}
                        />
                      </InputGroup>
                      {errors.username && (
                        <span className="text-[11px] text-destructive leading-none mt-1 block">
                          {errors.username.message}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 font-semibold select-all h-9">
                      <Key className="size-3.5 text-slate-400 shrink-0" />
                      {user.username}
                    </div>
                  )}
                </div>

                {/* Email Field (Always Read Only) */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Email (Tidak Dapat Diubah)</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/60 border border-slate-200/80 rounded-lg text-sm text-slate-500 font-medium select-all cursor-not-allowed h-9">
                    <Mail className="size-3.5 text-slate-400 shrink-0" />
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Subsection 2: Account Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="size-3.5 text-teal-600" />
                Detail Akun & Kredensial
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Pengguna (UUID)</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-lg text-xs font-mono text-slate-600 select-all h-9">
                    <FileText className="size-3.5 text-slate-400 shrink-0" />
                    {user.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu Registrasi</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-lg text-sm text-slate-700 font-semibold h-9">
                    <Calendar className="size-3.5 text-slate-400 shrink-0" />
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pembaruan Terakhir</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-lg text-sm text-slate-700 font-semibold h-9">
                    <Clock className="size-3.5 text-slate-400 shrink-0" />
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </CardContent>
    </Card>
  )
}
