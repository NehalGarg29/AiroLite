'use client'

import { useEffect, useState } from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { getReturns, getDisposition, updateStage } from '@/lib/api'

interface ReturnItem {
  id: number
  productName: string
  brand: string
  condition: string
  stage: string
  disposition: string | null
  aiReason: string | null
}

const STAGES = [
  { key: 'received', label: 'Received', color: '#6366f1' },
  { key: 'inspecting', label: 'Inspecting', color: '#f59e0b' },
  { key: 'repair', label: 'Repair', color: '#ef4444' },
  { key: 'resell', label: 'Resell', color: '#10b981' },
]

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnItem[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  useEffect(() => {
    fetchReturns()
  }, [])

  const fetchReturns = async () => {
    try {
      const res = await getReturns()
      setReturns(res.data)
    } catch (error) {
      console.error('Failed to fetch returns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisposition = async (id: number) => {
    setAnalyzing(id)
    try {
      await getDisposition(id)
      await fetchReturns()
    } catch (error) {
      console.error('Failed to get disposition:', error)
    } finally {
      setAnalyzing(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('returnId', String(id))
  }

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('returnId'))
    setDragOver(null)
    try {
      await updateStage(id, stage)
      await fetchReturns()
    } catch (error) {
      console.error('Failed to update stage:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    setDragOver(stage)
  }

  const getItemsByStage = (stage: string) =>
    returns.filter(r => r.stage === stage)

  if (loading) return (
    <div style={{ color: '#64748b', fontSize: '14px' }}>Loading returns...</div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RotateCcw size={24} color="#06b6d4" />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>Return Tracker</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          AI recommends repair, resell, or scrap for Samsung and LG product returns. Drag cards between stages.
        </p>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STAGES.map(stage => (
          <div
            key={stage.key}
            onDrop={(e) => handleDrop(e, stage.key)}
            onDragOver={(e) => handleDragOver(e, stage.key)}
            onDragLeave={() => setDragOver(null)}
            style={{
              backgroundColor: dragOver === stage.key ? '#1e2030' : '#1a1d27',
              border: `1px solid ${dragOver === stage.key ? stage.color : '#2d3148'}`,
              borderRadius: '12px',
              padding: '16px',
              minHeight: '400px',
              transition: 'all 0.15s'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: stage.color
                }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#94a3b8' }}>
                  {stage.label}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#2d3148',
                color: '#64748b'
              }}>
                {getItemsByStage(stage.key).length}
              </span>
            </div>

            {/* Cards */}
            {getItemsByStage(stage.key).map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                style={{
                  backgroundColor: '#0f1117',
                  border: '1px solid #2d3148',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '10px',
                  cursor: 'grab',
                  transition: 'border-color 0.15s'
                }}
              >
                {/* Brand badge */}
                <div style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: item.brand === 'Samsung' ? '#1e3a5f' : '#1a2e1a',
                  color: item.brand === 'Samsung' ? '#60a5fa' : '#4ade80',
                  marginBottom: '8px'
                }}>
                  {item.brand}
                </div>

                {/* Product name */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#f1f5f9',
                  marginBottom: '6px'
                }}>
                  {item.productName}
                </div>

                {/* Condition */}
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginBottom: '10px',
                  lineHeight: '1.5'
                }}>
                  {item.condition}
                </div>

                {/* Disposition badge */}
                {item.disposition && (
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: item.disposition === 'resell' ? '#052e16' : '#2d1515',
                    color: item.disposition === 'resell' ? '#4ade80' : '#f87171',
                    marginBottom: '8px',
                    display: 'inline-block'
                  }}>
                    → {item.disposition}
                  </div>
                )}

                {/* AI Reason */}
                {item.aiReason && (
                  <div style={{
                    fontSize: '11px',
                    color: '#475569',
                    lineHeight: '1.5',
                    marginBottom: '10px'
                  }}>
                    {item.aiReason.slice(0, 100)}...
                  </div>
                )}

                {/* AI Analyze button */}
                {!item.disposition && (
                  <button
                    onClick={() => handleDisposition(item.id)}
                    disabled={analyzing === item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#164e63',
                      color: '#22d3ee',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: analyzing === item.id ? 'not-allowed' : 'pointer',
                      opacity: analyzing === item.id ? 0.6 : 1,
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Sparkles size={11} />
                    {analyzing === item.id ? 'Analyzing...' : 'AI Analyze'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}