import { prisma } from '../../config/prisma.js';

export async function getOwnerProfile(userId: string) {
  const profile = await prisma.ownerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      equipment: true,
    },
  });

  if (!profile) {
    throw new Error('Owner profile not found.');
  }

  return profile;
}

export async function updateOwnerProfile(userId: string, data: {
  businessName?: string;
  locationName?: string;
  district?: string;
  state?: string;
  pincode?: string;
  contactPhone?: string;
}) {
  const profile = await prisma.ownerProfile.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });

  return profile;
}

export async function getOwnerDashboardStats(userId: string) {
  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId },
  });

  if (!ownerProfile) {
    throw new Error('Owner profile not found.');
  }

  const equipmentCount = await prisma.equipment.count({
    where: { ownerProfileId: ownerProfile.id },
  });

  const activeEquipmentCount = await prisma.equipment.count({
    where: { ownerProfileId: ownerProfile.id, isActive: true },
  });

  const pendingBookings = await prisma.booking.count({
    where: {
      equipment: { ownerProfileId: ownerProfile.id },
      status: 'PENDING',
    },
  });

  const confirmedBookings = await prisma.booking.count({
    where: {
      equipment: { ownerProfileId: ownerProfile.id },
      status: 'CONFIRMED',
    },
  });

  const totalEarningsResult = await prisma.booking.aggregate({
    where: {
      equipment: { ownerProfileId: ownerProfile.id },
      status: { in: ['CONFIRMED', 'COMPLETED'] },
    },
    _sum: { totalAmount: true },
  });

  return {
    equipmentCount,
    activeEquipmentCount,
    pendingBookings,
    confirmedBookings,
    totalEarnings: totalEarningsResult._sum.totalAmount || 0,
  };
}
