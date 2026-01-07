'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Map, Users, Gift, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/report', label: 'Report Trash', icon: Camera },
  { href: '/map', label: 'Trash Map', icon: Map },
  { href: '/volunteer', label: 'Volunteer', icon: Users },
  { href: '/kids', label: "Kids Zone", icon: Gift },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-green-600 to-green-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">VT</span>
            </div>
            <span className="ml-3 text-white text-xl font-bold">Village Trash</span>
          </div>
          
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-green-800 text-white'
                        : 'text-green-100 hover:bg-green-700 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 to-green-700">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">VT</span>
            </div>
            <span className="ml-2 text-white font-bold">Village Trash</span>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 rounded-md hover:bg-green-700"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-green-700 border-t border-green-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-green-800 text-white'
                        : 'text-green-100 hover:bg-green-700 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
