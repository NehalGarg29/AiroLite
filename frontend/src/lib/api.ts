import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Drivers
export const getDrivers = () => api.get('/api/drivers')

// Shipments
export const getShipments = () => api.get('/api/shipments')
export const assignDriver = (id: number) => api.post(`/api/shipments/${id}/assign`)
export const resetShipment = (id: number) => api.patch(`/api/shipments/${id}/reset`)

// Returns
export const getReturns = () => api.get('/api/returns')
export const getDisposition = (id: number) => api.post(`/api/returns/${id}/disposition`)
export const updateStage = (id: number, stage: string) => api.patch(`/api/returns/${id}/stage`, { stage })

// Routes
export const getRoutes = () => api.get('/api/routes')
export const optimizeRoute = (stops: string[]) => api.post('/api/routes/optimize', { stops })
export const deleteRoute = (id: number) => api.delete(`/api/routes/${id}`)

export default api