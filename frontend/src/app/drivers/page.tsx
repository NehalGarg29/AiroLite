'use client'

import { useEffect, useState } from 'react'
import { Truck, MapPin, Star, RefreshCw, CheckCircle } from 'lucide-react'
import { getShipments, getDrivers, assignDriver, resetShipment } from '@/lib/api'

interface Driver {
  id: number
  name: string
  available: boolean
  location: string
  vehicleType: string
  experience: number
}

interface Shipment {
  id: number
  trackingId: string
  origin: string
  destination: string
  weight: number
  type: string
  status: string
  aiReason: string | null
  driver: Driver | null
}

export default function DriversPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [shipmentsRes, driversRes] = await Promise.all([
        getShipments(),
        getDrivers()
      ])
      setShipments(shipmentsRes.data)
      setDrivers(driversRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (shipmentId: number) => {
    setAssigning(shipmentId)
    try {
      await assignDriver(shipmentId)
      await fetchData()
    } catch (error) {
      console.error('Failed to assign driver:', error)
    } finally {
      setAssigning(null)
    }
  }

  const handleReset = async (shipmentId: number) => {
    try {
      await resetShipment(shipmentId)
      await fetchData()
    } catch (error) {
      console.error('Failed to reset:', error)
    }
  }

  if (loading) return (
    <div style={{ color: '#64748b', fontSize: '14px' }}>Loading shipments...</div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Truck size={24} color="#6366f1" />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>Driver Assignment</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          AI recommends the best available driver for each shipment based on vehicle type, location, and experience.
        </p>
      </div>

      {/* Drivers Strip */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {drivers.map(driver => (
          <div key={driver.id} style={{
            backgroundColor: '#1a1d27',
            border: `1px solid ${driver.available ? '#2d3148' : '#1e2030'}`,
            borderRadius: '10px',
            padding: '12px 16px',
            opacity: driver.available ? 1 : 0.5,
            minWidth: '160px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#f1f5f9', marginBottom: '4px' }}>
              {driver.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <MapPin size={10} color="#64748b" />
              <span style={{ fontSize: '11px', color: '#64748b' }}>{driver.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <Star size={10} color="#64748b" />
              <span style={{ fontSize: '11px', color: '#64748b' }}>{driver.vehicleType} · {driver.experience}yr</span>
            </div>
            <div style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: '500',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: driver.available ? '#052e16' : '#1c1917',
              color: driver.available ? '#4ade80' : '#78716c',
            }}>
              {driver.available ? 'Available' : 'Unavailable'}
            </div>
          </div>
        ))}
      </div>

      {/* Shipments Table */}
      <div style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2d3148',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #2d3148',
          fontSize: '14px',
          fontWeight: '500',
          color: '#94a3b8'
        }}>
          Active Shipments
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2d3148' }}>
              {['Tracking ID', 'Origin', 'Destination', 'Type', 'Status', 'Assigned Driver', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#475569',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment, i) => (
              <tr key={shipment.id} style={{
                borderBottom: i < shipments.length - 1 ? '1px solid #1e2030' : 'none',
              }}>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>
                    {shipment.trackingId}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94a3b8' }}>
                  {shipment.origin}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94a3b8' }}>
                  {shipment.destination}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#1e1b4b',
                    color: '#a5b4fc'
                  }}>
                    {shipment.type}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: shipment.status === 'assigned' ? '#052e16' : '#1c1917',
                    color: shipment.status === 'assigned' ? '#4ade80' : '#78716c'
                  }}>
                    {shipment.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {shipment.driver ? (
                    <div>
                      <div style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: '500' }}>
                        {shipment.driver.name}
                      </div>
                      {shipment.aiReason && (
                        <div style={{
                          fontSize: '11px',
                          color: '#475569',
                          marginTop: '4px',
                          maxWidth: '200px',
                          lineHeight: '1.5'
                        }}>
                          {shipment.aiReason.slice(0, 80)}...
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#475569' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {shipment.status === 'unassigned' ? (
                    <button
                      onClick={() => handleAssign(shipment.id)}
                      disabled={assigning === shipment.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: assigning === shipment.id ? 'not-allowed' : 'pointer',
                        opacity: assigning === shipment.id ? 0.6 : 1,
                      }}
                    >
                      <CheckCircle size={12} />
                      {assigning === shipment.id ? 'Assigning...' : 'AI Assign'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReset(shipment.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: '1px solid #2d3148',
                        backgroundColor: 'transparent',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <RefreshCw size={12} />
                      Reset
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}