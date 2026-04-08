import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed Challenges
  const challenges = [
    {
      title: 'No Car Week',
      description: 'Go one week without using your personal car. Use public transport, bike, or walk instead.',
      category: 'transport',
      difficulty: 'medium',
      targetReduction: 25,
      duration: 7,
      points: 150,
      icon: '🚌',
    },
    {
      title: 'Energy Saver',
      description: 'Reduce your electricity consumption by 20% this week by turning off unnecessary lights and appliances.',
      category: 'energy',
      difficulty: 'easy',
      targetReduction: 15,
      duration: 7,
      points: 100,
      icon: '💡',
    },
    {
      title: 'Meatless Month',
      description: 'Go vegetarian for a month to reduce your carbon footprint from food.',
      category: 'food',
      difficulty: 'hard',
      targetReduction: 50,
      duration: 30,
      points: 300,
      icon: '🥗',
    },
    {
      title: 'Cold Shower Challenge',
      description: 'Take cold showers for a week to save energy used for heating water.',
      category: 'lifestyle',
      difficulty: 'medium',
      targetReduction: 10,
      duration: 7,
      points: 100,
      icon: '🚿',
    },
    {
      title: 'Zero Waste Week',
      description: 'Produce no landfill waste for a week. Recycle, compost, and avoid single-use items.',
      category: 'lifestyle',
      difficulty: 'hard',
      targetReduction: 20,
      duration: 7,
      points: 200,
      icon: '♻️',
    },
    {
      title: 'Local Food Only',
      description: 'Eat only locally sourced food for two weeks to reduce transportation emissions.',
      category: 'food',
      difficulty: 'medium',
      targetReduction: 15,
      duration: 14,
      points: 175,
      icon: '🌽',
    },
    {
      title: 'Bike to Work',
      description: 'Cycle to work every day for a week instead of driving.',
      category: 'transport',
      difficulty: 'medium',
      targetReduction: 30,
      duration: 5,
      points: 150,
      icon: '🚴',
    },
    {
      title: 'Unplug Challenge',
      description: 'Unplug all electronics when not in use for a week to eliminate phantom power consumption.',
      category: 'energy',
      difficulty: 'easy',
      targetReduction: 8,
      duration: 7,
      points: 75,
      icon: '🔌',
    },
  ]

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.title.toLowerCase().replace(/\s+/g, '-') },
      update: challenge,
      create: {
        id: challenge.title.toLowerCase().replace(/\s+/g, '-'),
        ...challenge,
      },
    })
  }

  console.log('Challenges seeded.')

  // Seed Recommendations
  const recommendations = [
    {
      title: 'Switch to LED Bulbs',
      description: 'Replace traditional incandescent bulbs with LED bulbs. They use 75% less energy and last 25 times longer.',
      category: 'energy',
      impact: 'medium',
      potentialSaving: 5,
      difficulty: 'easy',
    },
    {
      title: 'Use Public Transport',
      description: 'Take public transport instead of driving. A bus emits 89% less CO2 per passenger-km than a car.',
      category: 'transport',
      impact: 'high',
      potentialSaving: 20,
      difficulty: 'easy',
    },
    {
      title: 'Install Solar Panels',
      description: 'Consider installing solar panels to generate clean electricity and reduce dependence on the grid.',
      category: 'energy',
      impact: 'high',
      potentialSaving: 100,
      difficulty: 'hard',
    },
    {
      title: 'Reduce AC Usage',
      description: 'Set your AC to 24°C instead of 20°C. Each degree higher saves about 6% energy.',
      category: 'energy',
      impact: 'medium',
      potentialSaving: 15,
      difficulty: 'easy',
    },
    {
      title: 'Carpool to Work',
      description: 'Share rides with colleagues. Carpooling with just one other person cuts your commute emissions in half.',
      category: 'transport',
      impact: 'medium',
      potentialSaving: 12,
      difficulty: 'easy',
    },
    {
      title: 'Reduce Red Meat Consumption',
      description: 'Cut beef consumption by half. Beef production generates 20x more emissions than beans per gram of protein.',
      category: 'diet',
      impact: 'high',
      potentialSaving: 25,
      difficulty: 'medium',
    },
    {
      title: 'Air Dry Clothes',
      description: 'Skip the dryer and air dry your clothes. A dryer uses about 3 kWh per load.',
      category: 'lifestyle',
      impact: 'low',
      potentialSaving: 3,
      difficulty: 'easy',
    },
    {
      title: 'Buy Local Produce',
      description: 'Purchase locally grown fruits and vegetables to reduce transportation emissions.',
      category: 'diet',
      impact: 'low',
      potentialSaving: 4,
      difficulty: 'easy',
    },
    {
      title: 'Use a Pressure Cooker',
      description: 'Cook with a pressure cooker to reduce cooking time and energy use by up to 70%.',
      category: 'lifestyle',
      impact: 'low',
      potentialSaving: 2,
      difficulty: 'easy',
    },
    {
      title: 'Work from Home',
      description: 'If possible, work from home a few days a week to eliminate commute emissions entirely.',
      category: 'transport',
      impact: 'high',
      potentialSaving: 30,
      difficulty: 'medium',
    },
  ]

  for (const rec of recommendations) {
    await prisma.recommendation.upsert({
      where: { id: rec.title.toLowerCase().replace(/\s+/g, '-') },
      update: rec,
      create: {
        id: rec.title.toLowerCase().replace(/\s+/g, '-'),
        ...rec,
      },
    })
  }

  console.log('Recommendations seeded.')

  // Seed Emission Factors
  const emissionFactors = [
    { type: 'electricity', factor: 0.82, unit: 'kWh', region: 'IN', source: 'India Grid Emission Factor 2023' },
    { type: 'petrol', factor: 2.31, unit: 'L', region: 'IN', source: 'IPCC Guidelines' },
    { type: 'diesel', factor: 2.68, unit: 'L', region: 'IN', source: 'IPCC Guidelines' },
    { type: 'lpg', factor: 1.51, unit: 'L', region: 'IN', source: 'IPCC Guidelines' },
    { type: 'gas', factor: 2.0, unit: 'kg', region: 'IN', source: 'Natural Gas Emission Factor' },
    { type: 'water', factor: 0.376, unit: 'kL', region: 'IN', source: 'Water Treatment CO2' },
  ]

  for (const ef of emissionFactors) {
    await prisma.emissionFactor.upsert({
      where: { type_region: { type: ef.type, region: ef.region } },
      update: ef,
      create: ef,
    })
  }

  console.log('Emission factors seeded.')
  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
