import prisma from './db/client';
import { hashPassword } from './utils/password';
import { Role, Gender, TwoFactorMethod } from '@prisma/client';

const demoUsers = [
  {
    name: "Ahmed Al-Rashid",
    email: "admin@erp.com",
    password: "admin123",
    role: Role.super_admin,
    avatar: "https://ui-avatars.com/api/?name=Ahmed+Al-Rashid&background=3b82f6&color=fff",
    phone: "+966 50 123 4567",
    country: "Saudi Arabia",
    city: "Riyadh",
    address: "King Fahd Road, Building 42",
    dateOfBirth: new Date("1985-03-15"),
    gender: Gender.male,
    isActive: true,
    twoFactorEnabled: true,
    twoFactorMethod: TwoFactorMethod.otp,
    permissions: JSON.stringify([
      "dashboard.view",
      "sales.view", "sales.create", "sales.edit", "sales.delete",
      "finance.view", "finance.create", "finance.edit", "finance.delete",
      "inventory.view", "inventory.create", "inventory.edit", "inventory.delete",
      "users.view", "users.create", "users.edit", "users.delete",
      "settings.view", "settings.edit",
      "reports.view", "reports.export"
    ]),
  },
  {
    name: "Sara Hassan",
    email: "sara@erp.com",
    password: "sara123",
    role: Role.admin,
    avatar: "https://ui-avatars.com/api/?name=Sara+Hassan&background=7c3aed&color=fff",
    phone: "+966 55 987 6543",
    country: "Saudi Arabia",
    city: "Jeddah",
    address: "Tahlia Street, Suite 15",
    dateOfBirth: new Date("1990-07-22"),
    gender: Gender.female,
    isActive: true,
    twoFactorEnabled: false,
    permissions: JSON.stringify([
      "dashboard.view",
      "sales.view", "sales.create", "sales.edit",
      "finance.view", "finance.create", "finance.edit", "finance.delete",
      "inventory.view", "inventory.create", "inventory.edit", "inventory.delete",
      "users.view", "users.create", "users.edit",
      "settings.view", "settings.edit",
      "reports.view", "reports.export"
    ]),
  },
  {
    name: "Khalid Nasser",
    email: "khalid@erp.com",
    password: "khalid123",
    role: Role.accountant,
    avatar: "https://ui-avatars.com/api/?name=Khalid+Nasser&background=10b981&color=fff",
    phone: "+966 54 456 7890",
    country: "Saudi Arabia",
    city: "Dammam",
    address: "Prince Mohammed Bin Fahd Road",
    dateOfBirth: new Date("1988-11-05"),
    gender: Gender.male,
    isActive: true,
    twoFactorEnabled: true,
    twoFactorMethod: TwoFactorMethod.email,
    permissions: JSON.stringify([
      "dashboard.view",
      "finance.view", "finance.create", "finance.edit",
      "sales.invoices.view",
      "reports.view", "reports.export",
      "settings.view"
    ]),
  },
  {
    name: "Fatima Al-Zahrani",
    email: "fatima@erp.com",
    password: "fatima123",
    role: Role.salesman,
    avatar: "https://ui-avatars.com/api/?name=Fatima+Al-Zahrani&background=f59e0b&color=fff",
    phone: "+966 56 321 0987",
    country: "Saudi Arabia",
    city: "Mecca",
    address: "Al Aziziyah District",
    dateOfBirth: new Date("1993-02-14"),
    gender: Gender.female,
    isActive: true,
    twoFactorEnabled: false,
    permissions: JSON.stringify([
      "dashboard.view",
      "sales.view", "sales.create", "sales.edit",
      "sales.customers.view", "sales.customers.create",
      "inventory.items.view",
      "reports.view",
      "settings.view"
    ]),
  },
  {
    name: "Omar Youssef",
    email: "omar@erp.com",
    password: "omar123",
    role: Role.store_keeper,
    avatar: "https://ui-avatars.com/api/?name=Omar+Youssef&background=f43f5e&color=fff",
    phone: "+966 58 654 3210",
    country: "Saudi Arabia",
    city: "Medina",
    address: "Al Khalidiyah, Block 7",
    dateOfBirth: new Date("1995-09-30"),
    gender: Gender.male,
    isActive: false,
    twoFactorEnabled: false,
    permissions: JSON.stringify([
      "users.read",
      "products.read",
      "orders.read",
      "inventory.create", "inventory.read", "inventory.update",
      "reports.read"
    ]),
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clean existing users
    await prisma.user.deleteMany();
    console.log('🗑️  Cleared existing users');

    // Create demo users
    for (const userData of demoUsers) {
      const hashedPassword = await hashPassword(userData.password);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
