'use client'

import { useState } from 'react'
import { Route, Plus, Trash2, Sparkles, Clock } from 'lucide-react'
import { optimizeRoute } from '@/lib/api'

interface RouteResult {
  id: number
  stops: string[]
  optimized: string[]
  aiReason: string
  timeSaved?: string
}

export default function RoutesPage() {
  const [stops, setStops] = useState<string[]>(['', ''])
  const [result, setResult] = useState<RouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addStop = () => setStops([...stops, ''])

  const removeStop = (index: number) => {
    if (stops.length <= 2) return
    setStops(stops.filter((_, i) => i !== index))
  }

  const updateStop = (index: number, value: string) => {
    const updated = [...stops]
    updated[index] = value
    setStops(updated)
  }

  const handleOptimize = async () => {
    const validStops = stops.filter(s => s.trim() !== '')
    if (validStops.length < 2) {
      setError('Please enter at least 2 stops')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await optimizeRoute(validStops)
      setResult({
        ...res.data.route,
        timeSaved: res.data.recommendation.timeSaved
      })
    } catch (err) {
      setError('Failed to optimize route')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStops(['', ''])
    setResult(null)
    setError('')
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Route size={24} color="#8b5cf6" />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>Route Optimizer</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Enter your delivery stops and AI will reorder them for minimum distance and time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Input Panel */}
        <div style={{
          backgroundColor: '#1a1d27',
          border: '1px solid #2d3148',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8', marginBottom: '16px' }}>
            Delivery Stops
          </div>

          {stops.map((stop, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#2d3148',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#8b5cf6',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <input
                type="text"
                value={stop}
                onChange={(e) => updateStop(index, e.target.value)}
                placeholder={`Stop ${index + 1} — e.g. Carson Warehouse`}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #2d3148',
                  backgroundColor: '#0f1117',
                  color: '#f1f5f9',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => removeStop(index)}
                disabled={stops.length <= 2}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: stops.length <= 2 ? '#2d3148' : '#475569',
                  cursor: stops.length <= 2 ? 'not-allowed' : 'pointer',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={addStop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px dashed #2d3148',
              backgroundColor: 'transparent',
              color: '#475569',
              fontSize: '12px',
              cursor: 'pointer',
              marginBottom: '16px',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Plus size={14} />
            Add Stop
          </button>

          {error && (
            <div style={{ fontSize: '12px', color: '#f87171', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleOptimize}
              disabled={loading}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#7c3aed',
                color: 'white',
                fontSize: '13px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Sparkles size={14} />
              {loading ? 'Optimizing...' : 'AI Optimize'}
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #2d3148',
                backgroundColor: 'transparent',
                color: '#64748b',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div style={{
          backgroundColor: '#1a1d27',
          border: '1px solid #2d3148',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8', marginBottom: '16px' }}>
            Optimized Route
          </div>

          {!result ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#2d3148',
              gap: '12px'
            }}>
              <Sparkles size={32} />
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Enter stops and click AI Optimize
              </div>
            </div>
          ) : (
            <div>
              {/* Time saved badge */}
              {result.timeSaved && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#052e16',
                  color: '#4ade80',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '20px'
                }}>
                  <Clock size={12} />
                  {result.timeSaved} saved
                </div>
              )}

              {/* Optimized stops */}
              {result.optimized.map((stop, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: 'white',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  {index < result.optimized.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '37px',
                      width: '1px',
                      height: '20px',
                      backgroundColor: '#2d3148',
                      marginTop: '28px'
                    }} />
                  )}
                  <div style={{ fontSize: '13px', color: '#f1f5f9' }}>{stop}</div>
                </div>
              ))}

              {/* AI Reason */}
              <div style={{
                marginTop: '20px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0f1117',
                border: '1px solid #2d3148'
              }}>
                <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '500', marginBottom: '6px' }}>
                  AI REASONING
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                  {result.aiReason}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}