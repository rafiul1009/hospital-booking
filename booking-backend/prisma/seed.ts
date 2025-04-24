import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('1234', 10);
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@yopmail.com',
      password: hashedPassword,
      type: 'admin',
    },
  })

  console.log('Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })