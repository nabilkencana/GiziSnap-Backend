import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

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

  async googleLogin(email: string, name: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const hashed = await bcrypt.hash(Math.random().toString(36).slice(-8) + 'Google1!', 10);
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
