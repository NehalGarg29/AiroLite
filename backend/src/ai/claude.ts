import 'dotenv/config'

// When you have an API key, swap this to false
const USE_MOCK = true

export async function getDriverRecommendation(
  shipment: {
    trackingId: string
    origin: string
    destination: string
    weight: number
    type: string
  },
  drivers: {
    id: number
    name: string
    available: boolean
    location: string
    vehicleType: string
    experience: number
  }[]
) {
  if (USE_MOCK) {
    // Find first available driver matching vehicle type
    const match = drivers.find(
      (d) => d.available && d.vehicleType === shipment.type
    )
    const driver = match || drivers.find((d) => d.available)
    return {
      driverId: driver?.id,
      driverName: driver?.name,
      reason: `Mock AI: ${driver?.name} is recommended for shipment ${shipment.trackingId} because they operate a ${driver?.vehicleType} vehicle matching the shipment type, are currently available, and are located nearest to the origin at ${driver?.location}.`,
    }
  }

  // REAL Claude API call — uncomment when you have API key
  // const Anthropic = (await import('@anthropic-ai/sdk')).default
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // const response = await client.messages.create({
  //   model: 'claude-sonnet-4-6',
  //   max_tokens: 1024,
  //   messages: [{
  //     role: 'user',
  //     content: `You are a logistics AI for KW International.
  //     Shipment: ${JSON.stringify(shipment)}
  //     Available drivers: ${JSON.stringify(drivers)}
  //     Return JSON only: { "driverId": number, "driverName": string, "reason": string }`
  //   }]
  // })
  // const text = response.content[0].type === 'text' ? response.content[0].text : ''
  // return JSON.parse(text)
}

export async function getRouteOptimization(stops: string[]) {
  if (USE_MOCK) {
    const optimized = [...stops].reverse()
    return {
      optimizedStops: optimized,
      reason: `Mock AI: Optimized route by reversing stop order to minimize backtracking. Estimated 23% reduction in total distance compared to original order.`,
      timeSaved: '47 minutes',
    }
  }
}

export async function getReturnDisposition(product: {
  productName: string
  brand: string
  condition: string
}) {
  if (USE_MOCK) {
    const condition = product.condition.toLowerCase()
    let disposition = 'resell'
    if (condition.includes('crack') || condition.includes('failure')) {
      disposition = 'repair'
    } else if (condition.includes('perfect') || condition.includes('works fine')) {
      disposition = 'resell'
    } else {
      disposition = 'repair'
    }
    return {
      disposition,
      reason: `Mock AI: Based on the condition "${product.condition}", this ${product.brand} ${product.productName} is recommended for ${disposition}. ${disposition === 'resell' ? 'Minor issues do not affect functionality or resale value.' : 'Damage requires professional repair before the unit can re-enter inventory.'}`,
    }
  }
}