'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Truck, Package, RotateCcw, Route, Cpu } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Cpu },
  { href: '/drivers', label: 'Driver Assignment', icon: Truck },
  { href: '/routes', label: 'Route Optimizer', icon: Route },
  { href: '/returns', label: 'Return Tracker', icon: RotateCcw },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#1a1d27',
      borderRight: '1px solid #2d3148',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>AIRO Lite</div>
            <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.05em' }}>KW INTERNATIONAL</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '4px',
                textDecoration: 'none',
                backgroundColor: isActive ? '#2d3148' : 'transparent',
                color: isActive ? '#a5b4fc' : '#94a3b8',
                fontSize: '14px',
                fontWeight: isActive ? '500' : '400',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '24px', borderTop: '1px solid #2d3148' }}>
        <div style={{ fontSize: '11px', color: '#475569' }}>AI Resource Optimization</div>
        <div style={{ fontSize: '11px', color: '#475569' }}>v1.0.0 — Mock AI Mode</div>
      </div>
    </aside>
  )
}