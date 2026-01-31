'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Heart,
  Pill,
  Calendar,
  MessageSquare,
  CreditCard,
  Package,
  Stethoscope,
  Users,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const patientNavItems = [
  { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/patient/profile', icon: User },
  { name: 'Chronic Diseases', href: '/patient/chronic-disease', icon: Heart },
  { name: 'Medications', href: '/patient/medications', icon: Pill },
  { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
  { name: 'Chat', href: '/patient/chat', icon: MessageSquare },
  { name: 'Insurance', href: '/patient/insurance', icon: CreditCard },
  { name: 'Medical Supply', href: '/patient/medical-supply', icon: Package },
]

const doctorNavItems = [
  { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/doctor/profile', icon: User },
  { name: 'Patients', href: '/doctor/patients', icon: Users },
  { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
  { name: 'Schedule', href: '/doctor/schedule', icon: Calendar },
  { name: 'Chat', href: '/doctor/chat', icon: MessageSquare },
  { name: 'Analytics', href: '/doctor/analytics', icon: BarChart3 },
  { name: 'Alerts', href: '/doctor/alerts', icon: Bell },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isDoctorRoute = pathname.startsWith('/doctor')
  const navItems = isDoctorRoute ? doctorNavItems : patientNavItems

  return (
    <aside className={cn(
      "h-screen bg-white border-r border-gray-200 transition-all duration-300 sticky top-0",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-xl font-bold text-healthcare-blue">
                HealthCare Pro
              </h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-healthcare-blue text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-healthcare-blue rounded-full flex items-center justify-center text-white">
              JD
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">
                  {isDoctorRoute ? 'Doctor' : 'Patient'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}