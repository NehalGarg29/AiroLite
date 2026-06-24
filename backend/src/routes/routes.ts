import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { getRouteOptimization } from '../ai/claude'

const router = Router()

// GET all saved routes
router.get('/', async (req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(routes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' })
  }
})

// POST optimize a route with AI
router.post('/optimize', async (req: Request, res: Response) => {
  try {
    const { stops } = req.body

    if (!stops || !Array.isArray(stops) || stops.length < 2) {
      res.status(400).json({ error: 'Please provide at least 2 stops' })
      return
    }

    // Ask AI to optimize the stops
    const recommendation = await getRouteOptimization(stops)

    // Save the route to database
    const route = await prisma.route.create({
      data: {
        stops: stops,
        optimized: recommendation?.optimizedStops,
        aiReason: recommendation?.reason
      }
    })

    res.json({
      route,
      recommendation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize route' })
  }
})

// DELETE a saved route
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.route.delete({
      where: { id: Number(id) }
    })
    res.json({ message: 'Route deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete route' })
  }
})

export default router