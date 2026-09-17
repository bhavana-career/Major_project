import { prisma } from '../../config/prisma.js';

export async function createBooking(farmerUserId: string, data: {
  equipmentId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}) {
  const reqStart = new Date(data.startDate);
  const reqEnd = new Date(data.endDate);

  if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime())) {
    throw new Error('Invalid start date or end date format.');
  }

  if (reqStart > reqEnd) {
    throw new Error('Start date must be on or before end date.');
  }

  // Calculate rental duration in days (inclusive of start and end date)
  const diffTime = Math.abs(reqEnd.getTime() - reqStart.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // 1. Fetch Equipment details
  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
  });

  if (!equipment) {
    throw new Error('Equipment not found.');
  }

  if (!equipment.isActive) {
    throw new Error('Equipment is currently deactivated by the owner and unavailable for booking.');
  }

  // 2. BACKEND CONFLICT ENGINE: Check for date overlaps with existing PENDING or CONFIRMED bookings
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      equipmentId: data.equipmentId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      AND: [
        { startDate: { lte: reqEnd } },
        { endDate: { gte: reqStart } },
      ],
    },
  });

  if (conflictingBooking) {
    const conflictStart = conflictingBooking.startDate.toISOString().split('T')[0];
    const conflictEnd = conflictingBooking.endDate.toISOString().split('T')[0];
    throw new Error(
      `Date Collision: This equipment is already booked or requested between ${conflictStart} and ${conflictEnd}. Please select alternative dates.`
    );
  }

  // 3. Generate Unique Booking Number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const bookingNumber = `BK-${dateStr}-${randomSuffix}`;

  const totalAmount = totalDays * equipment.pricePerDay;

  // 4. Create Booking
  const booking = await prisma.booking.create({
    data: {
      bookingNumber,
      equipmentId: data.equipmentId,
      farmerId: farmerUserId,
      startDate: reqStart,
      endDate: reqEnd,
      totalDays,
      pricePerDay: equipment.pricePerDay,
      totalAmount,
      notes: data.notes || '',
      status: 'PENDING',
    },
    include: {
      equipment: {
        include: {
          ownerProfile: {
            include: { user: { select: { id: true, name: true, phone: true } } },
          },
        },
      },
    },
  });

  return booking;
}

export async function getFarmerBookings(farmerUserId: string) {
  const bookings = await prisma.booking.findMany({
    where: { farmerId: farmerUserId },
    include: {
      equipment: {
        include: {
          ownerProfile: {
            include: { user: { select: { id: true, name: true, phone: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings;
}

export async function getOwnerBookings(ownerUserId: string) {
  const ownerProfile = await prisma.ownerProfile.findUnique({
    where: { userId: ownerUserId },
  });

  if (!ownerProfile) {
    throw new Error('Owner profile not found.');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      equipment: { ownerProfileId: ownerProfile.id },
    },
    include: {
      equipment: true,
      farmer: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings;
}

export async function updateBookingStatus(
  userId: string,
  bookingId: string,
  newStatus: 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      equipment: {
        include: { ownerProfile: true },
      },
    },
  });

  if (!booking) {
    throw new Error('Booking not found.');
  }

  // Ensure owner owns the equipment or farmer is cancelling their pending request
  const isOwner = booking.equipment.ownerProfile.userId === userId;
  const isFarmer = booking.farmerId === userId;

  if (!isOwner && !isFarmer) {
    throw new Error('Unauthorized to update this booking.');
  }

  if (newStatus === 'CONFIRMED' && !isOwner) {
    throw new Error('Only the equipment owner can confirm booking requests.');
  }

  // Double check date conflicts if confirming
  if (newStatus === 'CONFIRMED') {
    const conflictingConfirmed = await prisma.booking.findFirst({
      where: {
        id: { not: booking.id },
        equipmentId: booking.equipmentId,
        status: 'CONFIRMED',
        AND: [
          { startDate: { lte: booking.endDate } },
          { endDate: { gte: booking.startDate } },
        ],
      },
    });

    if (conflictingConfirmed) {
      throw new Error('Cannot confirm: Equipment is already confirmed for another booking during these dates.');
    }
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
    include: {
      equipment: true,
      farmer: { select: { id: true, name: true, phone: true } },
    },
  });

  return updated;
}
