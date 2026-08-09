import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, LogOut, Store, User, Settings } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { useUserMe } from '@/features/users/hooks/useUserMe'

export function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const { data, isLoading } = useUserMe()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground flex items-center justify-center">
            <Store className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">
            Toko Beras Putra Mandiri
          </span>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center uppercase shadow-sm">
              <User className="w-4 h-4" strokeWidth={2.5} />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs text-slate-800 font-semibold leading-tight">
                {isLoading ? (
                  <Spinner className="size-3 text-slate-400" />
                ) : (
                  data?.data.name || 'Staff'
                )}
              </div>
              <div className="text-xs text-slate-500 leading-tight">
                {data?.data.role?.name || 'Kasir'}
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Transparent Backdrop untuk Click Outside */}
          {showDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
          )}

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">

              {/* Header Info User */}
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {data?.data.name || 'Staff'}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {data?.data.email || 'staff@toko.com'}
                </p>
              </div>

              {/* Navigation Links */}
              <div className="py-1">
                <Link
                  href="/cashier/users"
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Profil Saya
                </Link>

                <Link
                  href="/cashier/settings"
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Pengaturan
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    setShowLogoutModal(true)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

            </div>
          )}
        </div>
      </header>

      {/* Reusable Confirm Modal */}
      <ConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="Konfirmasi Keluar?"
        description="Anda perlu login kembali untuk mengakses aplikasi."
        onConfirm={() => {
          setShowLogoutModal(false)
          logout()
        }}
        isLoading={isLoggingOut}
        confirmText="Ya, Keluar"
        loadingText="keluar..."
        variant="danger"
      />
    </>
  )
}