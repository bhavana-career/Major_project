import { prisma } from '../../config/prisma.js';
import { calculateDistanceKm } from '../../utils/distance.js';

export async function searchEquipment(filters: {
  query?: string;
  equipmentType?: string;
  locationName?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  farmerLat?: number;
  farmerLon?: number;
}) {
  const whereClause: any = {
    isActive: true,
  };

  if (filters.equipmentType && filters.equipmentType !== 'ALL') {
    whereClause.equipmentType = { equals: filters.equipmentType, mode: 'insensitive' };
  }

  if (filters.query) {
    const q = filters.query.trim();
    whereClause.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { locationName: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    whereClause.pricePerDay = {};
    if (filters.minPrice !== undefined) whereClause.pricePerDay.gte = Number(filters.minPrice);
    if (filters.maxPrice !== undefined) whereClause.pricePerDay.lte = Number(filters.maxPrice);
  }

  // Fetch equipment list with owner details
  const list = await prisma.equipment.findMany({
    where: whereClause,
    include: {
      ownerProfile: {
        include: {
          user: { select: { id: true, name: true, phone: true } },
        },
      },
      bookings: {
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        select: { startDate: true, endDate: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate distance & check date availability
  const reqStart = filters.startDate ? new Date(filters.startDate) : null;
  const reqEnd = filters.endDate ? new Date(filters.endDate) : null;

  const result = list.map((item) => {
    const distanceKm = calculateDistanceKm(
      filters.farmerLat || 12.9716,
      filters.farmerLon || 77.5946,
      item.latitude || 12.95,
      item.longitude || 77.6
    );

    // Check if item has overlapping bookings for requested dates
    let isAvailable = true;
    if (reqStart && reqEnd) {
      const hasConflict = item.bookings.some((b) => {
        const bStart = new Date(b.startDate);
        const bEnd = new Date(b.endDate);
        return reqStart <= bEnd && reqEnd >= bStart;
      });
      if (hasConflict) {
        isAvailable = false;
      }
    }

    return {
      id: item.id,
      title: item.title,
      equipmentType: item.equipmentType,
      brand: item.brand,
      model: item.model,
      description: item.description,
      pricePerDay: item.pricePerDay,
      locationName: item.locationName,
      latitude: item.latitude,
      longitude: item.longitude,
      verificationStatus: item.verificationStatus,
      isActive: item.isActive,
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&q=80',
      specs: item.specs,
      distanceKm,
      isAvailable,
      owner: {
        name: item.ownerProfile.user.name,
        businessName: item.ownerProfile.businessName,
        phone: item.ownerProfile.contactPhone || item.ownerProfile.user.phone,
        location: item.ownerProfile.locationName,
      },
      unavailableDates: item.bookings.map((b) => ({
        start: b.startDate,
        end: b.endDate,
        status: b.status,
      })),
    };
  });

  return result;
}

export async function getEquipmentById(id: string) {
  const item = await prisma.equipment.findUnique({
    where: { id },
    include: {
      ownerProfile: {
        include: {
          user: { select: { id: true, name: true, phone: true } },
        },
      },
      bookings: {
        where: { status: { in: ['PENDING', 'CONFIRMED'] } },
        select: { id: true, startDate: true, endDate: true, status: true },
      },
    },
  });

  if (!item) {
    throw new Error('Equipment not found.');
  }

  const distanceKm = calculateDistanceKm(
    12.9716,
    77.5946,
    item.latitude || 12.95,
    item.longitude || 77.6
  );

  return {
    ...item,
    distanceKm,
    owner: {
      name: item.ownerProfile.user.name,
      businessName: item.ownerProfile.businessName,
      phone: item.ownerProfile.contactPhone || item.ownerProfile.user.phone,
      location: item.ownerProfile.locationName,
    },
    unavailableDates: item.bookings.map((b) => ({
      start: b.startDate,
      end: b.endDate,
      status: b.status,
    })),
  };
}

export async function createEquipment(userId: string, data: {
  title: string;
  equipmentType: string;
  brand: string;
  model: string;
  description: string;
  pricePerDay: number;
  locationName: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  specs?: string;
}) {
  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId },
  });

  if (!ownerProfile) {
    throw new Error('Owner profile not found. Please register as an Owner.');
  }

  const equipment = await prisma.equipment.create({
    data: {
      ownerProfileId: ownerProfile.id,
      title: data.title,
      equipmentType: data.equipmentType,
      brand: data.brand,
      model: data.model,
      description: data.description,
      pricePerDay: Number(data.pricePerDay),
      locationName: data.locationName,
      latitude: data.latitude ? Number(data.latitude) : 12.95,
      longitude: data.longitude ? Number(data.longitude) : 77.6,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800&q=80',
      specs: data.specs,
      verificationStatus: 'VERIFIED', // Default MVP verified status
      isActive: true,
    },
  });

  return equipment;
}

export async function updateEquipment(userId: string, equipmentId: string, data: any) {
  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId },
  });

  if (!ownerProfile) {
    throw new Error('Owner profile not found.');
  }

  const existing = await prisma.equipment.findFirst({
    where: { id: equipmentId, ownerProfileId: ownerProfile.id },
  });

  if (!existing) {
    throw new Error('Equipment not found or not owned by you.');
  }

  const updated = await prisma.equipment.update({
    where: { id: equipmentId },
    data: {
      ...data,
      pricePerDay: data.pricePerDay !== undefined ? Number(data.pricePerDay) : undefined,
    },
  });

  return updated;
}

export async function toggleEquipmentStatus(userId: string, equipmentId: string, isActive: boolean) {
  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId },
  });

  if (!ownerProfile) {
    throw new Error('Owner profile not found.');
  }

  const existing = await prisma.equipment.findFirst({
    where: { id: equipmentId, ownerProfileId: ownerProfile.id },
  });

  if (!existing) {
    throw new Error('Equipment not found or not owned by you.');
  }

  const updated = await prisma.equipment.update({
    where: { id: equipmentId },
    data: { isActive },
  });

  return updated;
}

export async function getOwnedEquipment(userId: string) {
  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId },
  });

  if (!ownerProfile) {
    throw new Error('Owner profile not found.');
  }

  const list = await prisma.equipment.findMany({
    where: { ownerProfileId: ownerProfile.id },
    include: {
      bookings: {
        select: { id: true, startDate: true, endDate: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return list;
}
