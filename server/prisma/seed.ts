import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for Agricultural Equipment Rental Platform...');

  // 1. Create Roles
  const farmerRole = await prisma.role.upsert({
    where: { name: 'FARMER' },
    update: {},
    create: { name: 'FARMER' },
  });

  const ownerRole = await prisma.role.upsert({
    where: { name: 'OWNER' },
    update: {},
    create: { name: 'OWNER' },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create Equipment Owner (Ramesh Gowda)
  const ownerPhone = '9876543210';
  let ownerUser = await prisma.user.findUnique({ where: { phone: ownerPhone } });

  if (!ownerUser) {
    ownerUser = await prisma.user.create({
      data: {
        phone: ownerPhone,
        name: 'Ramesh Gowda',
        passwordHash,
        userRoles: { create: { roleId: ownerRole.id } },
        ownerProfile: {
          create: {
            businessName: 'Gowda Agro Equipment Services',
            locationName: 'Mandya, Karnataka',
            district: 'Mandya',
            state: 'Karnataka',
            pincode: '571401',
            contactPhone: ownerPhone,
          },
        },
      },
    });
  }

  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId: ownerUser.id },
  });

  // 3. Create Sample Machinery Listings
  const sampleEquipment = [
    {
      title: 'Mahindra 575 DI 45 HP Tractor',
      equipmentType: 'Tractor',
      brand: 'Mahindra',
      model: '575 DI',
      description: 'Heavy duty 45 HP tractor equipped with rotavator attachment. Perfect for land preparation and deep plowing.',
      pricePerDay: 2000,
      locationName: 'Mandya, Karnataka',
      latitude: 12.5218,
      longitude: 76.8951,
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&q=80',
      specs: '45 HP Engine, Dual Clutch, Power Steering, 8 Forward + 2 Reverse gears',
    },
    {
      title: 'Kubota Combine Harvester DC-68G',
      equipmentType: 'Harvester',
      brand: 'Kubota',
      model: 'DC-68G',
      description: 'High efficiency multi-crop paddy & wheat combine harvester with grain tank. Saves manual labor.',
      pricePerDay: 3500,
      locationName: 'Maddur, Mandya District',
      latitude: 12.5843,
      longitude: 77.0425,
      imageUrl: 'https://images.unsplash.com/photo-1530267981608-bc70a27e9877?w=800&q=80',
      specs: '68 HP Diesel Engine, Track Type Crawler, 2.0m Cutter Bar Width',
    },
    {
      title: 'Swaraj 744 FE 48 HP Tractor',
      equipmentType: 'Tractor',
      brand: 'Swaraj',
      model: '744 FE',
      description: 'Reliable 48 HP tractor suitable for heavy hauling, tilling, and sugarcane transport.',
      pricePerDay: 2200,
      locationName: 'Srirangapatna, Mandya',
      latitude: 12.4223,
      longitude: 76.6853,
      imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&q=80',
      specs: '48 HP, 3 Cylinder Engine, 2000 kg Hydraulics Lift Capacity',
    },
    {
      title: 'Shrachi Multi-Crop Power Tiller 15 HP',
      equipmentType: 'Tiller',
      brand: 'Shrachi',
      model: '15 HP Diesel Tiller',
      description: 'Compact power tiller for wet paddy cultivation, weeding, and small acre land preparation.',
      pricePerDay: 900,
      locationName: 'Koppa, Maddur Taluk',
      latitude: 12.6102,
      longitude: 77.0125,
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      specs: '15 HP Diesel Engine, Rotavator width 600mm, Electric Start',
    },
  ];

  for (const eq of sampleEquipment) {
    const existing = await prisma.equipment.findFirst({
      where: { ownerProfileId: ownerProfile!.id, title: eq.title },
    });
    if (!existing) {
      await prisma.equipment.create({
        data: {
          ownerProfileId: ownerProfile!.id,
          ...eq,
          verificationStatus: 'VERIFIED',
          isActive: true,
        },
      });
    }
  }

  // 4. Create Farmer (Ravi Kumar)
  const farmerPhone = '9123456789';
  let farmerUser = await prisma.user.findUnique({ where: { phone: farmerPhone } });

  if (!farmerUser) {
    farmerUser = await prisma.user.create({
      data: {
        phone: farmerPhone,
        name: 'Ravi Kumar',
        passwordHash,
        userRoles: { create: { roleId: farmerRole.id } },
        farmerProfile: {
          create: {
            district: 'Mandya',
            taluk: 'Maddur',
            village: 'Koppa',
            state: 'Karnataka',
            totalLandAcres: 4.5,
            primaryCrops: 'Paddy, Sugarcane',
            farms: {
              create: [
                {
                  name: 'Green Field Farm',
                  locationName: 'Koppa Village, Maddur',
                  areaAcres: 3.0,
                  soilType: 'Red Loam',
                  crops: {
                    create: [{ cropName: 'Paddy', season: 'Kharif', areaAcres: 3.0 }],
                  },
                },
              ],
            },
          },
        },
      },
    });
  }

  // 5. Create a sample initial pending booking for demonstration
  const mahindraTractor = await prisma.equipment.findFirst({
    where: { title: { contains: 'Mahindra' } },
  });

  if (mahindraTractor && farmerUser) {
    const existingBooking = await prisma.booking.findFirst({
      where: { equipmentId: mahindraTractor.id, farmerId: farmerUser.id },
    });

    if (!existingBooking) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 2); // 2 days from today
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 4); // 4 days from today

      const totalDays = 3;
      const totalAmount = totalDays * mahindraTractor.pricePerDay;

      await prisma.booking.create({
        data: {
          bookingNumber: `BK-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
          equipmentId: mahindraTractor.id,
          farmerId: farmerUser.id,
          startDate,
          endDate,
          totalDays,
          pricePerDay: mahindraTractor.pricePerDay,
          totalAmount,
          status: 'PENDING',
          notes: 'Need tractor for soil preparation for paddy cultivation.',
        },
      });
    }
  }

  console.log('✅ Database successfully seeded!');
  console.log('--------------------------------------------------');
  console.log('DEMO ACCOUNTS CREATED FOR REVIEW 1:');
  console.log('🌾 Farmer Account: Phone 9123456789 | Password: password123');
  console.log('🚜 Owner Account:  Phone 9876543210 | Password: password123');
  console.log('--------------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
