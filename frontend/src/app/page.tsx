'use client'

import { Truck, RotateCcw, Route, Cpu } from 'lucide-react'
import Link from 'next/link'

const modules = [
  {
    href: '/drivers',
    icon: Truck,
    title: 'Driver Assignment',
    description: 'AI recommends the best driver for each shipment based on vehicle type, location, and availability.',
    color: '#6366f1',
    stat: '5 drivers active',
  },
  {
    href: '/routes',
    icon: Route,
    title: 'Route Optimizer',
    description: 'AI orders delivery stops to minimize distance and time across KW delivery runs.',
    color: '#8b5cf6',
    stat: 'Saves ~47 min per route',
  },
  {
    href: '/returns',
    icon: RotateCcw,
    title: 'Return Tracker',
    description: 'AI recommends repair, resell, or scrap for Samsung and LG product returns.',
    color: '#06b6d4',
    stat: '5 returns in pipeline',
  },
]

export default function Home() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Cpu size={28} color="#6366f1" />
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>
            AIRO Lite
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '500px' }}>
          AI-powered resource optimization for KW International's logistics operations.
          Assign drivers, optimize routes, and manage returns — all in one place.
        </p>
      </div>

      {/* Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <Link key={mod.href} href={mod.href} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#1a1d27',
                border: '1px solid #2d3148',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = mod.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2d3148')}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: `${mod.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={20} color={mod.color} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  {mod.title}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
                  {mod.description}
                </div>
                <div style={{ fontSize: '12px', color: mod.color, fontWeight: '500' }}>
                  {mod.stat}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* About Box */}
      <div style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2d3148',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>
          <strong style={{ color: '#94a3b8' }}>About AIRO Lite —</strong> Built to mirror the mission of KW International's
          AI Resource Optimization (AIRO) team. KW operates end-to-end logistics across freight forwarding,
          3PL warehousing, milk run delivery, and reverse logistics for clients including Samsung and LG.
          This tool demonstrates how AI can optimize resource decisions across each of those operations.
        </div>
      </div>
    </div>
  )
}