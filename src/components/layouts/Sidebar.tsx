import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Clock,
  Coffee,
  Percent,
  Boxes,
  Building2,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  LucideIcon
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { Permission } from '@/features/auth/types/auth'

const iconMap: Record<string, LucideIcon> = {
  'dashboard': LayoutDashboard,
  'pos:create': ShoppingCart,
  'transactions:read': Receipt,
  'shifts:read': Clock,
  'products': Coffee,
  'discounts': Percent,
  'inventory': Boxes,
  'suppliers-purchases': Building2,
  'customers-loyalty': Users,
  'reports': BarChart3,
  'employees': Users,
  'settings:read': Settings,
};

const getIcon = (name: string): LucideIcon => {
  return iconMap[name] || HelpCircle;
};

const routeMap: Record<string, string> = {
  '/dashboard': '/admin/dashboard',
  '/pos': '/admin/pos',
  '/transactions': '/admin/transactions',
  '/shifts': '/admin/shifts',
  '/products/list': '/admin/products',
  '/products/units': '/admin/units',
  '/products/categories': '/admin/categories',
  '/discounts': '/admin/discounts',
  '/discounts/products': '/admin/products/discounts',
  '/inventory/stock': '/admin/inventory/product-stock',
  '/inventory/opname': '/admin/inventory/opname',
  '/suppliers': '/admin/suppliers',
  '/purchases': '/admin/purchases',
  '/customers': '/admin/customers',
  '/loyalty-settings': '/admin/loyalty-settings',
  '/reports': '/admin/reports',
  '/users': '/admin/users',
  '/roles': '/admin/roles',
  '/settings': '/admin/settings',
};

const getFePath = (bePath: string | null): string => {
  if (!bePath) return '#';
  return routeMap[bePath] || `/admin${bePath}`;
};

const cleanLabel = (desc: string): string => {
  let label = desc.startsWith('Menu ') ? desc.slice(5) : desc;
  if (label.toLowerCase().endsWith(' group')) {
    label = label.slice(0, -6);
  }
  return label;
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  const permissions = useAuthStore((state) => state.permissions) || []

  // Hanya ambil menu utama di root level (level 1)
  const allowedMenus = permissions.filter(
    (item) => item.parentId === null && item.type === 'menu'
  )

  const isPathActive = (path: string) => {
    if (path === '#') return false
    return pathname === path || pathname.startsWith(path + '/')
  }

  const isGroupActive = (item: Permission) =>
    item.children?.some((child) => {
      const path = getFePath(child.path)
      return path !== '#' && isPathActive(path)
    }) ?? false

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <aside
      className={`relative bg-white border-r border-slate-200 h-full flex flex-col transition-[width] duration-300 ease-in-out shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar transition-[padding] duration-300 ease-in-out ${
        isCollapsed ? 'pl-[18px] pr-[14px]' : 'px-4'
      }`}>
        {allowedMenus.map((item, index) => {
          const Icon = getIcon(item.name)

          // Hanya ambil child item bertipe menu (level 2)
          const menuChildren = (item.children || []).filter(
            (child) => child.type === 'menu'
          )

          const hasSingleChildMenu = menuChildren.length === 1;

          if (menuChildren.length === 0 || hasSingleChildMenu) {
            const leafPath = getFePath(hasSingleChildMenu ? menuChildren[0].path : item.path)
            const active = isPathActive(leafPath)
            return (
              <div key={item.id}>
                {/* Leaf item */}
                <Link
                  href={leafPath}
                  title={isCollapsed ? cleanLabel(item.description) : undefined}
                  className={`flex items-center rounded-xl transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'py-3 px-[14px] gap-0' : 'py-3 px-4 gap-3'
                  } ${
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
                    {cleanLabel(item.description)}
                  </span>
                </Link>
                {index === 0 && <hr className="border-slate-200 my-2" />}
              </div>
            )
          }

          const groupActive = isGroupActive(item)
          const isOpen = !isCollapsed && (openGroups[item.name] ?? groupActive)

          return (
            <div key={item.id}>
              <button
                onClick={() => !isCollapsed && toggleGroup(item.name)}
                title={isCollapsed ? cleanLabel(item.description) : undefined}
                className={`w-full flex items-center rounded-xl transition-all duration-300 ease-in-out cursor-pointer ${
                  isCollapsed ? 'py-3 px-[14px] gap-0' : 'py-3 px-4 gap-3'
                } ${
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
                  {cleanLabel(item.description)}
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
                    {menuChildren.map((child) => {
                      const childPath = getFePath(child.path)
                      const active = isPathActive(childPath)
                      return (
                        <Link
                          key={child.id}
                          href={childPath}
                          className={`block py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                            active
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {cleanLabel(child.description)}
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