import { prisma } from '../../config/prisma.js';

export async function getFarmerProfile(userId: string) {
  const profile = await prisma.farmerProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      farms: { include: { crops: true } },
    },
  });

  if (!profile) {
    throw new Error('Farmer profile not found.');
  }

  return profile;
}

export async function updateFarmerProfile(userId: string, data: {
  district?: string;
  taluk?: string;
  village?: string;
  pincode?: string;
  state?: string;
  totalLandAcres?: number;
  primaryCrops?: string;
}) {
  const profile = await prisma.farmerProfile.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });

  return profile;
}

export async function addFarm(userId: string, farmData: {
  name: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  areaAcres: number;
  soilType?: string;
  crops?: Array<{ cropName: string; season?: string; areaAcres?: number }>;
}) {
  const farmerProfile = await prisma.farmerProfile.findUnique({
    where: { userId },
  });

  if (!farmerProfile) {
    throw new Error('Farmer profile not found.');
  }

  const farm = await prisma.farm.create({
    data: {
      farmerProfileId: farmerProfile.id,
      name: farmData.name,
      locationName: farmData.locationName,
      latitude: farmData.latitude,
      longitude: farmData.longitude,
      areaAcres: farmData.areaAcres,
      soilType: farmData.soilType,
      crops: farmData.crops ? {
        create: farmData.crops.map((c) => ({
          cropName: c.cropName,
          season: c.season || 'Kharif',
          areaAcres: c.areaAcres || farmData.areaAcres,
        })),
      } : undefined,
    },
    include: { crops: true },
  });

  return farm;
}
