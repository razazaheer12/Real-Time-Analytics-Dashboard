import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await Promise.all(
    ['Electronics', 'Clothing', 'Groceries', 'Furniture', 'Books'].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  // Regions
  const regions = await Promise.all(
    [
      { name: 'North America', code: 'NA' },
      { name: 'Europe', code: 'EU' },
      { name: 'Asia Pacific', code: 'APAC' },
      { name: 'South Asia', code: 'SA' },
    ].map((r) =>
      prisma.region.upsert({
        where: { name: r.name },
        update: {},
        create: r,
      }),
    ),
  );

  // Admin + Viewer test users (agar already nahi hain to)
  const hashedPassword = await bcrypt.hash('test123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { role: Role.ADMIN },
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@test.com' },
    update: {},
    create: {
      email: 'viewer@test.com',
      password: hashedPassword,
      name: 'Viewer User',
      role: Role.VIEWER,
    },
  });

  // Historical Metrics — pichle 30 din ka random data
  const metricsData: any[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    for (const category of categories) {
      for (const region of regions) {
        metricsData.push({
          title: `${category.name} Revenue`,
          value: Math.floor(Math.random() * 50000) + 5000,
          unit: 'USD',
          categoryId: category.id,
          regionId: region.id,
          createdAt: date,
          updatedAt: date,
        });
      }
    }
  }

  await prisma.metric.createMany({ data: metricsData });

  console.log(`✅ Seeded: ${categories.length} categories, ${regions.length} regions, ${metricsData.length} metrics, 2 users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });