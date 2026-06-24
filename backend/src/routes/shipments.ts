import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { getDriverRecommendation } from '../ai/claude'

const router = Router()

// GET all shipments
router.get('/', async (req: Request, res: Response) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: { driver: true },
      orderBy: { createdAt: 'asc' }
    })
    res.json(shipments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments' })
  }
})

// POST AI assign driver to shipment
router.post('/:id/assign', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Get the shipment
    const shipment = await prisma.shipment.findUnique({
      where: { id: Number(id) }
    })

    if (!shipment) {
      res.status(404).json({ error: 'Shipment not found' })
      return
    }

    // Get all available drivers
    const drivers = await prisma.driver.findMany({
      where: { available: true }
    })

    if (drivers.length === 0) {
      res.status(400).json({ error: 'No available drivers' })
      return
    }

    // Ask AI for recommendation
    const recommendation = await getDriverRecommendation(shipment, drivers)

    if (!recommendation?.driverId) {
      res.status(500).json({ error: 'AI could not make a recommendation' })
      return
    }

    // Update shipment with assigned driver
    const updated = await prisma.shipment.update({
      where: { id: Number(id) },
      data: {
        driverId: recommendation.driverId,
        status: 'assigned',
        aiReason: recommendation.reason
      },
      include: { driver: true }
    })

    res.json({
      shipment: updated,
      recommendation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign driver' })
  }
})

// PATCH reset shipment assignment
router.patch('/:id/reset', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await prisma.shipment.update({
      where: { id: Number(id) },
      data: {
        driverId: null,
        status: 'unassigned',
        aiReason: null
      }
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset shipment' })
  }
})

export default router