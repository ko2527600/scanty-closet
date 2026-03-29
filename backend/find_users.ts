import { prisma } from './src/lib/prisma.js';
async function main() {
  const users = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log('USERS_LIST_START');
  console.log(JSON.stringify(users));
  console.log('USERS_LIST_END');
}
main().catch(console.error);
