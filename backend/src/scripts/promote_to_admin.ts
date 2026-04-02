import 'dotenv/config';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'Ohenekobi98@gmail.com';
  const password = 'admin123';
  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      role: 'ADMIN',
      password_hash: password_hash
    },
    create: {
      email,
      password_hash,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`✅ ADMIN_PROMOTED: ${user.email} is now an Admin!`);
}

main()
  .catch((e) => {
    console.error('❌ Failed to promote admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
