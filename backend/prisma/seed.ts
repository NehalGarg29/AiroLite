import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clear existing data
  await prisma.shipment.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.return.deleteMany()
  await prisma.route.deleteMany()

  // Create drivers
  await prisma.driver.createMany({
    data: [
      {
        name: 'Marcus Johnson',
        available: true,
        location: 'Carson, CA',
        vehicleType: 'FTL',
        experience: 8,
      },
      {
        name: 'Sarah Kim',
        available: true,
        location: 'Long Beach, CA',
        vehicleType: 'LTL',
        experience: 5,
      },
      {
        name: 'David Torres',
        available: false,
        location: 'Compton, CA',
        vehicleType: 'Milk Run',
        experience: 3,
      },
      {
        name: 'James Lee',
        available: true,
        location: 'Carson, CA',
        vehicleType: 'FTL',
        experience: 12,
      },
      {
        name: 'Priya Patel',
        available: true,
        location: 'Torrance, CA',
        vehicleType: 'LTL',
        experience: 6,
      },
    ],
  })

  // Create shipments
  await prisma.shipment.createMany({
    data: [
      {
        trackingId: 'KW-001',
        origin: 'Port of LA',
        destination: 'Amazon Fulfillment - ONT8',
        weight: 1200,
        type: 'FTL',
        status: 'unassigned',
      },
      {
        trackingId: 'KW-002',
        origin: 'Carson Warehouse',
        destination: 'Best Buy - Torrance',
        weight: 340,
        type: 'LTL',
        status: 'unassigned',
      },
      {
        trackingId: 'KW-003',
        origin: 'Port of LA',
        destination: 'Samsung Service Center - Gardena',
        weight: 890,
        type: 'FTL',
        status: 'unassigned',
      },
      {
        trackingId: 'KW-004',
        origin: 'Carson Warehouse',
        destination: 'LG Distribution - Compton',
        weight: 210,
        type: 'LTL',
        status: 'unassigned',
      },
      {
        trackingId: 'KW-005',
        origin: 'Port of Long Beach',
        destination: 'Amazon Fulfillment - LAX9',
        weight: 1500,
        type: 'FTL',
        status: 'unassigned',
      },
    ],
  })

  // Create returns
  await prisma.return.createMany({
    data: [
      {
        productName: '65" QLED TV',
        brand: 'Samsung',
        condition: 'cracked screen',
        stage: 'received',
      },
      {
        productName: 'French Door Refrigerator',
        brand: 'LG',
        condition: 'minor dents, fully functional',
        stage: 'inspecting',
      },
      {
        productName: '55" OLED TV',
        brand: 'LG',
        condition: 'remote missing, works fine',
        stage: 'received',
      },
      {
        productName: 'Front Load Washer',
        brand: 'Samsung',
        condition: 'motor failure',
        stage: 'inspecting',
      },
      {
        productName: '75" Neo QLED TV',
        brand: 'Samsung',
        condition: 'perfect condition, wrong item sent',
        stage: 'received',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())