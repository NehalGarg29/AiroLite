import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { getReturnDisposition } from '../ai/claude'

const router = Router()

// GET all returns
router.get('/', async (req: Request, res: Response) => {
  try {
    const returns = await prisma.return.findMany({
      orderBy: { createdAt: 'asc' }
    })
    res.json(returns)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch returns' })
  }
})

// POST AI recommend disposition for a return
router.post('/:id/disposition', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const returnItem = await prisma.return.findUnique({
      where: { id: Number(id) }
    })

    if (!returnItem) {
      res.status(404).json({ error: 'Return not found' })
      return
    }

    // Ask AI for disposition recommendation
    const recommendation = await getReturnDisposition({
      productName: returnItem.productName,
      brand: returnItem.brand,
      condition: returnItem.condition
    })

    // Update return with AI recommendation
    const updated = await prisma.return.update({
      where: { id: Number(id) },
      data: {
        disposition: recommendation?.disposition,
        aiReason: recommendation?.reason
      }
    })

    res.json({
      return: updated,
      recommendation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get disposition' })
  }
})

// PATCH update return stage (for kanban drag)
router.patch('/:id/stage', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { stage } = req.body

    const updated = await prisma.return.update({
      where: { id: Number(id) },
      data: { stage }
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stage' })
  }
})

export default router