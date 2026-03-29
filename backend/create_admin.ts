import { prisma } from './src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@scanty.com';
  const password = 'admin123';
  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: {
      email,
      password_hash,
      first_name: 'Admin',
      last_name: 'User',
      role: 'ADMIN',
    },
  });

  console.log(`ADMIN_READY: ${user.email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
