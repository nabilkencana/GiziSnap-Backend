import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email sudah terdaftar');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashed,
        goal: dto.goal ?? 'WEIGHT_LOSS',
        targetCalories: dto.goal === 'BODYBUILDING' ? 2800 : dto.goal === 'DIABETES_CARE' ? 1800 : 1600,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Email tidak terdaftar');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Kata sandi salah');

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Verifikasi Google ID Token dari Google Identity Services (GSI).
   * Tidak mempercayai email/nama dari frontend — semua diambil dari token yang
   * sudah diverifikasi secara kriptografis oleh Google.
   */
  async googleLogin(idToken: string) {
    if (!idToken) throw new BadRequestException('ID Token tidak boleh kosong');

    let email: string;
    let name: string;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token Google tidak valid');
      }
      email = payload.email;
      name = payload.name || payload.email.split('@')[0] || 'Pengguna Google';
    } catch (e) {
      throw new UnauthorizedException('Gagal memverifikasi token Google: ' + (e as Error).message);
    }

    // Upsert: buat user baru jika belum ada, atau gunakan yang sudah ada
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashed = await bcrypt.hash(
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + 'Ggl!',
        10,
      );
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashed,
          goal: 'PENDING',
          targetCalories: 2000,
        },
      });
    }

    const { password: _, ...result } = user;
    return result;
  }

  async updateGoal(userId: string, goal: string) {
    let targetCalories = 2000;
    if (goal === 'WEIGHT_LOSS') targetCalories = 1600;
    else if (goal === 'DIABETES_CARE') targetCalories = 1800;
    else if (goal === 'BODYBUILDING') targetCalories = 2800;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { goal, targetCalories }
    });

    const { password: _, ...result } = user;
    return result;
  }
}
