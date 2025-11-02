import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = 'admin@gmail.com';
  const adminPassword = await bcrypt.hash('123123', 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log('✅ Admin criado:', admin.email);
  } else {
    console.log('ℹ️ Admin já existe:', adminEmail);
  }

  console.log('✨ Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
