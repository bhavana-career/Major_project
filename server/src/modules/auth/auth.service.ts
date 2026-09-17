import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { generateOtp, sendDevOtp } from '../../utils/otp.js';
import { generateToken } from '../../utils/jwt.js';

export async function requestOtp(phone: string, purpose: string = 'REGISTRATION') {
  const cleanPhone = phone.trim();
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete previous pending OTPs for this phone
  await prisma.otpVerification.deleteMany({
    where: { phone: cleanPhone, isVerified: false },
  });

  await prisma.otpVerification.create({
    data: {
      phone: cleanPhone,
      code,
      expiresAt,
      purpose,
    },
  });

  sendDevOtp(cleanPhone, code);

  return {
    success: true,
    message: 'OTP sent successfully to your phone number.',
    devOtp: process.env.NODE_ENV === 'development' ? code : undefined,
  };
}

export async function verifyOtp(phone: string, code: string) {
  const cleanPhone = phone.trim();

  const record = await prisma.otpVerification.findFirst({
    where: {
      phone: cleanPhone,
      code: code.trim(),
      isVerified: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    throw new Error('Invalid or expired OTP code.');
  }

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { isVerified: true },
  });

  return {
    success: true,
    message: 'OTP verified successfully.',
    verificationToken: record.id,
  };
}

export async function registerUser(data: {
  phone: string;
  password: string;
  name: string;
  role: 'FARMER' | 'OWNER';
  verificationToken?: string;
  district?: string;
  taluk?: string;
  village?: string;
  businessName?: string;
  locationName?: string;
}) {
  const cleanPhone = data.phone.trim();

  // Check unique phone
  const existingUser = await prisma.user.findUnique({
    where: { phone: cleanPhone },
  });

  if (existingUser) {
    throw new Error('An account with this phone number already exists.');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  // Ensure role exists in DB
  let roleRecord = await prisma.role.findUnique({
    where: { name: data.role },
  });

  if (!roleRecord) {
    roleRecord = await prisma.role.create({
      data: { name: data.role },
    });
  }

  // Create User in Transaction with Profile
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        phone: cleanPhone,
        name: data.name,
        passwordHash,
      },
    });

    await tx.userRole.create({
      data: {
        userId: newUser.id,
        roleId: roleRecord!.id,
      },
    });

    if (data.role === 'FARMER') {
      await tx.farmerProfile.create({
        data: {
          userId: newUser.id,
          district: data.district || 'Mandya',
          taluk: data.taluk || 'Maddur',
          village: data.village || 'Koppa',
          state: 'Karnataka',
        },
      });
    } else if (data.role === 'OWNER') {
      await tx.ownerProfile.create({
        data: {
          userId: newUser.id,
          businessName: data.businessName || `${data.name}'s Equipment Services`,
          locationName: data.locationName || `${data.district || 'Mandya'}, Karnataka`,
          district: data.district || 'Mandya',
          contactPhone: cleanPhone,
          state: 'Karnataka',
        },
      });
    }

    return newUser;
  });

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    roles: [data.role],
  });

  return {
    success: true,
    message: 'User registered successfully.',
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: data.role,
    },
  };
}

export async function loginUser(phone: string, password: string) {
  const cleanPhone = phone.trim();

  const user = await prisma.user.findUnique({
    where: { phone: cleanPhone },
    include: {
      userRoles: {
        include: { role: true },
      },
      farmerProfile: true,
      ownerProfile: true,
    },
  });

  if (!user) {
    throw new Error('Invalid phone number or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid phone number or password.');
  }

  const roles = user.userRoles.map((ur) => ur.role.name);

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    roles,
  });

  return {
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      roles,
      farmerProfile: user.farmerProfile,
      ownerProfile: user.ownerProfile,
    },
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: { include: { role: true } },
      farmerProfile: { include: { farms: { include: { crops: true } } } },
      ownerProfile: true,
    },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const roles = user.userRoles.map((ur) => ur.role.name);

  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    roles,
    farmerProfile: user.farmerProfile,
    ownerProfile: user.ownerProfile,
  };
}
