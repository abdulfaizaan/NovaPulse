import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const dept = await prisma.department.create({
    data: { name: 'Engineering' }
  });

  const admin = await prisma.user.create({
    data: {
      fullName: 'System Admin',
      email: 'admin@novapulse.io',
      password: hashedPassword,
      role: 'ADMIN',
      departmentId: dept.id,
    }
  });

  const manager = await prisma.user.create({
    data: {
      fullName: 'Engineering Manager',
      email: 'manager@novapulse.io',
      password: hashedPassword,
      role: 'MANAGER',
      departmentId: dept.id,
    }
  });

  const employee = await prisma.user.create({
    data: {
      fullName: 'Software Engineer',
      email: 'employee@novapulse.io',
      password: hashedPassword,
      role: 'EMPLOYEE',
      departmentId: dept.id,
      managerId: manager.id,
    }
  });

  console.log({ admin, manager, employee });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
