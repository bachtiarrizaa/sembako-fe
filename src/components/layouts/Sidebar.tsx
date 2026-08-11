import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Coffee,
  Percent,
  Boxes,
  Building2,
  Clock,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useUserMe } from '@/features/users/hooks/useUserMe'

interface SubMenuItem {
  name: string
  path: string
}

interface MenuItem {
  name: string
  path?: string
  icon: typeof LayoutDashboard
  roles: string[]
  children?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'cashier'] },
  { name: 'POS / Kasir', path: '/admin/pos', icon: ShoppingCart, roles: ['admin', 'cashier'] },
  { name: 'Transaksi', path: '/admin/transaction', icon: Receipt, roles: ['admin', 'cashier'] },
  {
    name: 'Produk & Satuan',
    icon: Coffee,
    roles: ['admin', 'cashier'],
    children: [
      { name: 'Semua Produk', path: '/admin/products' },
      { name: 'Satuan', path: '/admin/units' },
      { name: 'Kategori', path: '/admin/categories' },
    ],
  },
  {
    name: 'Promosi',
    icon: Percent,
    roles: ['admin'],
    children: [
      { name: 'Semua Diskon', path: '/admin/discounts' },
      { name: 'Diskon Produk', path: '/admin/products/discounts' },
    ],
  },
  {
    name: 'Stok & Bahan',
    icon: Boxes,
    roles: ['admin', 'cashier'],
    children: [
      { name: 'Bahan Baku', path: '/admin/inventory/ingredients' },
      { name: 'Stok Bahan', path: '/admin/inventory/ingredient-stock' },
      { name: 'Stok Produk', path: '/admin/inventory/product-stock' },
    ],
  },
  { name: 'Customer', path: '/admin/customers', icon: Building2, roles: ['admin'] },
  { name: 'Shift', path: '/admin/shifts', icon: Clock, roles: ['admin', 'cashier'] },
  { name: 'Laporan', path: '/admin/reports', icon: BarChart3, roles: ['admin'] },
  {
    name: 'Pegawai',
    icon: Users,
    roles: ['admin'],
    children: [
      { name: 'Semua Pegawai', path: '/admin/users' },
      { name: 'Role', path: '/admin/roles' },
    ],
  },
  { name: 'Pengaturan', path: '/admin/settings', icon: Settings, roles: ['admin'] },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  const { data } = useUserMe()
  const user = useAuthStore((state) => state.user)

  const userRole = (data?.data.role?.name || user?.role?.name || '').toLowerCase()
  const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/cashier/dashboard'

  const displayedMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  const isPathActive = (path: string) => {
    if (pathname === path) return true
    if (pathname.startsWith(path + '/')) {
      const isMoreSpecificMatchExist = menuItems.some((item) => {
        if (item.path && item.path !== path && item.path.startsWith(path) && pathname.startsWith(item.path)) {
          return true
        }
        return item.children?.some((child) => 
          child.path !== path && child.path.startsWith(path) && pathname.startsWith(child.path)
        )
      })
      return !isMoreSpecificMatchExist
    }
    return false
  }

  const isGroupActive = (item: MenuItem) =>
    item.children?.some((child) => isPathActive(child.path)) ?? false

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <aside
      className={`relative bg-white border-r border-slate-200 h-full flex flex-col transition-[width] duration-300 ease-in-out shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {displayedMenuItems.map((item, index) => {
          const Icon = item.icon

          if (!item.children) {
            const leafPath = item.path ?? dashboardPath
            const active = isPathActive(leafPath)
            return (
              <div key={item.name}>
                {/* Leaf item */}
                <Link
                  href={leafPath}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center py-3 px-4 gap-3 rounded-xl transition-colors duration-200 ${
                    active
                      ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/15'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span
                    className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-out ${
                      isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
                {index === 0 && <hr className="border-slate-200 my-2" />}
              </div>
            )
          }

          const groupActive = isGroupActive(item)
          const isOpen = !isCollapsed && (openGroups[item.name] ?? groupActive)

          return (
            <div key={item.name}>
              <button
                onClick={() => !isCollapsed && toggleGroup(item.name)}
                title={isCollapsed ? item.name : undefined}
                className={`w-full flex items-center py-3 px-4 gap-3 rounded-xl transition-colors duration-200 cursor-pointer ${
                  groupActive
                    ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/15'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-out flex-1 text-left ${
                    isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
                  }`}
                >
                  {item.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-all duration-300 ease-out ${
                    isOpen ? 'rotate-180' : ''
                  } ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[16px] opacity-100'}`}
                />
              </button>

              {/* Grid trick: animate height dari 0fr ke 1fr, bukan conditional render */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-4 pl-4 border-l border-slate-200 mt-1 space-y-1 pb-1">
                    {item.children.map((child) => {
                      const active = isPathActive(child.path)
                      return (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`block py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                            active
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {child.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              {index === 0 && <hr className="border-slate-200 my-2" />}
            </div>
          )
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="cursor-pointer absolute top-4 -right-3 w-6 h-6 rounded-full bg-primary text-white border border-slate-200 hover:bg-primary/90 transition-colors flex items-center justify-center shadow-md z-30 translate-y-1/2"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}