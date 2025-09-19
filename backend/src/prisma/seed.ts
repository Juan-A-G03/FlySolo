import { PrismaClient } from '@prisma/client';
import { AuthUtils } from '../utils/auth.utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await AuthUtils.hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@flysolo.com' },
    update: {},
    create: {
      email: 'admin@flysolo.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'FlySolo',
      role: 'ADMIN',
      faction: 'NEUTRAL',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create test Imperial pilot
  const pilotPassword = await AuthUtils.hashPassword('pilot123');
  const pilot = await prisma.user.upsert({
    where: { email: 'han.solo@flysolo.com' },
    update: {},
    create: {
      email: 'han.solo@flysolo.com',
      password: pilotPassword,
      firstName: 'Han',
      lastName: 'Solo',
      role: 'PILOT',
      faction: 'REBEL',
    },
  });

  console.log('✅ Created rebel pilot user:', pilot.email);

  // Create Imperial pilot
  const imperialPilotPassword = await AuthUtils.hashPassword('empire123');
  const imperialPilot = await prisma.user.upsert({
    where: { email: 'vader@empire.gov' },
    update: {},
    create: {
      email: 'vader@empire.gov',
      password: imperialPilotPassword,
      firstName: 'Darth',
      lastName: 'Vader',
      role: 'PILOT',
      faction: 'IMPERIAL',
    },
  });

  console.log('✅ Created imperial pilot user:', imperialPilot.email);

  // Create test rebel user
  const userPassword = await AuthUtils.hashPassword('user123');
  const user = await prisma.user.upsert({
    where: { email: 'luke.skywalker@flysolo.com' },
    update: {},
    create: {
      email: 'luke.skywalker@flysolo.com',
      password: userPassword,
      firstName: 'Luke',
      lastName: 'Skywalker',
      role: 'USER',
      faction: 'REBEL',
    },
  });

  console.log('✅ Created rebel user:', user.email);

  // Create Imperial user
  const imperialUserPassword = await AuthUtils.hashPassword('empire123');
  const imperialUser = await prisma.user.upsert({
    where: { email: 'palpatine@empire.gov' },
    update: {},
    create: {
      email: 'palpatine@empire.gov',
      password: imperialUserPassword,
      firstName: 'Emperor',
      lastName: 'Palpatine',
      role: 'USER',
      faction: 'IMPERIAL',
    },
  });

  console.log('✅ Created imperial user:', imperialUser.email);

  // Create solar systems
  const coreSystems = await prisma.solarSystem.upsert({
    where: { name: 'Core Systems' },
    update: {},
    create: {
      name: 'Core Systems',
      centerX: 0,
      centerY: 0,
      centerZ: 0,
    },
  });

  const outerRim = await prisma.solarSystem.upsert({
    where: { name: 'Outer Rim' },
    update: {},
    create: {
      name: 'Outer Rim',
      centerX: 500,
      centerY: 300,
      centerZ: 100,
    },
  });

  console.log('✅ Created solar systems');

  // Create planets
  await prisma.planet.upsert({
    where: { name: 'Coruscant' },
    update: {},
    create: {
      name: 'Coruscant',
      solarSystemId: coreSystems.id,
      coordinateX: 10,
      coordinateY: 5,
      coordinateZ: 2,
    },
  });

  await prisma.planet.upsert({
    where: { name: 'Tatooine' },
    update: {},
    create: {
      name: 'Tatooine',
      solarSystemId: outerRim.id,
      coordinateX: 520,
      coordinateY: 310,
      coordinateZ: 90,
    },
  });

  await prisma.planet.upsert({
    where: { name: 'Alderaan' },
    update: {},
    create: {
      name: 'Alderaan',
      solarSystemId: coreSystems.id,
      coordinateX: -15,
      coordinateY: 8,
      coordinateZ: -3,
    },
  });

  console.log('✅ Created planets');

  // Create ships
  await prisma.ship.upsert({
    where: { registration: 'YT-1300' },
    update: {},
    create: {
      name: 'Millennium Falcon',
      model: 'YT-1300 Light Freighter',
      registration: 'YT-1300',
      passengerCapacity: 6,
      cargoCapacity: 100.0,
      canHyperspaceTravel: true,
      createdBy: admin.id,
    },
  });

  await prisma.ship.upsert({
    where: { registration: 'T-65' },
    update: {},
    create: {
      name: 'X-Wing Starfighter',
      model: 'T-65 X-wing',
      registration: 'T-65',
      passengerCapacity: 1,
      cargoCapacity: 10.0,
      canHyperspaceTravel: true,
      createdBy: admin.id,
    },
  });

  console.log('✅ Created ships');

  // Create weapons
  await prisma.weapon.upsert({
    where: { name: 'Laser Cannon' },
    update: {},
    create: {
      name: 'Laser Cannon',
      type: 'Energy',
      damage: 50,
      description: 'Standard laser cannon for space combat',
      createdBy: admin.id,
    },
  });

  await prisma.weapon.upsert({
    where: { name: 'Ion Cannon' },
    update: {},
    create: {
      name: 'Ion Cannon',
      type: 'Ion',
      damage: 30,
      description: 'Disables electronic systems without destroying the target',
      createdBy: admin.id,
    },
  });

  console.log('✅ Created weapons');

  // Create pilot stats for the pilot
  await prisma.pilotStats.upsert({
    where: { pilotId: pilot.id },
    update: {},
    create: {
      pilotId: pilot.id,
      totalTrips: 0,
      totalDistance: 0,
      averageRating: 0,
      totalEarnings: 0,
    },
  });

  console.log('✅ Created pilot stats');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Test accounts:');
  console.log('Admin: admin@flysolo.com / admin123 (Neutral)');
  console.log('Rebel Pilot: han.solo@flysolo.com / pilot123 (Rebel Alliance)');
  console.log('Imperial Pilot: vader@empire.gov / empire123 (Galactic Empire)');
  console.log('Rebel User: luke.skywalker@flysolo.com / user123 (Rebel Alliance)');
  console.log('Imperial User: palpatine@empire.gov / empire123 (Galactic Empire)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });