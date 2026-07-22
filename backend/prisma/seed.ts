import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

let url = process.env.DATABASE_URL as string;
if (url?.startsWith('prisma+postgres://')) {
  const b64 = url.split('api_key=')[1];
  const decoded = JSON.parse(Buffer.from(b64, 'base64').toString());
  url = decoded.databaseUrl;
}
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  const categoryCS = await prisma.category.upsert({
    where: { slug: 'computer-science' },
    update: {},
    create: {
      name: 'Computer Science',
      nameAr: 'علوم الحاسوب',
      slug: 'computer-science',
    },
  });

  const categoryBusiness = await prisma.category.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      name: 'Business',
      nameAr: 'إدارة الأعمال',
      slug: 'business',
    },
  });

  const categorySelfHelp = await prisma.category.upsert({
    where: { slug: 'self-help' },
    update: {},
    create: {
      name: 'Self-Help',
      nameAr: 'تطوير الذات',
      slug: 'self-help',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-0134494166' },
    update: {},
    create: {
      title: 'Clean Architecture',
      titleAr: 'البنية النظيفة',
      author: 'Robert C. Martin',
      isbn: '978-0134494166',
      categoryId: categoryCS.id,
      totalCopies: 5,
      availableCopies: 3,
      pageCount: 432,
      publishedYear: 2017,
      publisher: 'Prentice Hall',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-0307887894' },
    update: {},
    create: {
      title: 'The Lean Startup',
      titleAr: 'الشركة الناشئة المرنة',
      author: 'Eric Ries',
      isbn: '978-0307887894',
      categoryId: categoryBusiness.id,
      totalCopies: 3,
      availableCopies: 0,
      pageCount: 336,
      publishedYear: 2011,
      publisher: 'Crown Business',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-0735211292' },
    update: {},
    create: {
      title: 'Atomic Habits',
      titleAr: 'العادات الذرية',
      author: 'James Clear',
      isbn: '978-0735211292',
      categoryId: categorySelfHelp.id,
      totalCopies: 10,
      availableCopies: 8,
      pageCount: 320,
      publishedYear: 2018,
      publisher: 'Avery',
    },
  });

  const studentPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'student@sob.local' },
    update: {},
    create: {
      email: 'student@sob.local',
      name: 'SOB Student',
      password: studentPassword,
      role: Role.USER,
    },
  });

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@sob.local' },
    update: {},
    create: {
      email: 'admin@sob.local',
      name: 'System Admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
