import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET all drivers
router.get('/', async (req: Request, res: Response) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'asc' }
    })
    res.json(drivers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' })
  }
})

// PATCH toggle driver availability
router.patch('/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { available } = req.body

    const driver = await prisma.driver.update({
      where: { id: Number(id) },
      data: { available }
    })
    res.json(driver)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update driver' })
  }
})

export default router