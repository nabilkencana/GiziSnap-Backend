import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';

export interface ProfileDto {
  weight:           number;   // kg
  height:           number;   // cm
  age:              number;
  gender:           'male' | 'female';
  activityLevel:    'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal:             string;
  healthConditions: string[];
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Algoritma AI Kalkulasi Target ──────────────────────────────────────────
  private calculateTargets(profile: ProfileDto) {
    const { weight, height, age, gender, activityLevel, goal, healthConditions } = profile;

    // 1. BMR (Harris-Benedict)
    let bmr: number;
    if (gender === 'male') {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
      bmr = 447.6 + (9.25 * weight) + (3.1 * height) - (4.3 * age);
    }

    // 2. TDEE (activity multiplier)
    const activityMultiplier: Record<string, number> = {
      sedentary:  1.2,
      light:      1.375,
      moderate:   1.55,
      active:     1.725,
      very_active: 1.9,
    };
    const tdee = bmr * (activityMultiplier[activityLevel] ?? 1.2);

    // 3. Target kalori berdasarkan goal
    const hasCardio   = healthConditions.some(c => ['jantung_koroner', 'gagal_jantung', 'aritmia', 'stroke'].includes(c));
    const hasDiabetes = healthConditions.includes('diabetes');

    let targetCalories: number;
    if (goal === 'WEIGHT_LOSS') {
      targetCalories = tdee - 500;
    } else if (goal === 'DIABETES_CARE' || hasDiabetes) {
      targetCalories = tdee - 200;
    } else if (goal === 'BODYBUILDING') {
      targetCalories = tdee + 300;
    } else {
      targetCalories = tdee;
    }
    // Klip minimum kalori aman
    targetCalories = Math.max(targetCalories, gender === 'male' ? 1500 : 1200);

    // 4. Makro split (gram)
    let proteinRatio = 0.30, carbRatio = 0.40, fatRatio = 0.30;
    if (goal === 'WEIGHT_LOSS') {
      proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
    } else if (goal === 'DIABETES_CARE' || hasDiabetes) {
      proteinRatio = 0.30; carbRatio = 0.25; fatRatio = 0.45;
    } else if (goal === 'BODYBUILDING') {
      proteinRatio = 0.30; carbRatio = 0.45; fatRatio = 0.25;
    }
    // Koreksi kardiovaskular: kurangi lemak jenuh
    if (hasCardio) { fatRatio -= 0.05; carbRatio += 0.05; }

    const targetProtein = Math.round((targetCalories * proteinRatio) / 4); // 4 kal/g protein
    const targetCarbs   = Math.round((targetCalories * carbRatio)   / 4); // 4 kal/g karbo
    const targetFat     = Math.round((targetCalories * fatRatio)    / 9); // 9 kal/g lemak

    // 5. Target air (ml)
    const activityWaterBonus: Record<string, number> = {
      sedentary: 0, light: 200, moderate: 400, active: 600, very_active: 800,
    };
    let waterTarget = weight * 33; // base: 33ml/kg
    waterTarget += activityWaterBonus[activityLevel] ?? 0;
    if (hasDiabetes)                                    waterTarget += 300;
    if (healthConditions.includes('hipertensi'))        waterTarget += 200;
    if (healthConditions.includes('batu_ginjal'))       waterTarget += 500;
    if (healthConditions.includes('asam_urat'))         waterTarget += 300;
    if (hasCardio)                                       waterTarget += 200;

    return {
      targetCalories: Math.round(targetCalories),
      targetProtein,
      targetCarbs,
      targetFat,
      waterTarget:    Math.round(waterTarget),
      bmr:            Math.round(bmr),
      tdee:           Math.round(tdee),
    };
  }

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

  async updateProfile(userId: string, profileDto: ProfileDto) {
    const targets = this.calculateTargets(profileDto);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        weight:           profileDto.weight,
        height:           profileDto.height,
        age:              profileDto.age,
        gender:           profileDto.gender,
        activityLevel:    profileDto.activityLevel,
        healthConditions: profileDto.healthConditions,
        goal:             profileDto.goal,
        targetCalories:   targets.targetCalories,
        targetProtein:    targets.targetProtein,
        targetCarbs:      targets.targetCarbs,
        targetFat:        targets.targetFat,
        waterTarget:      targets.waterTarget,
        profileComplete:  true,
      },
    });

    const { password: _, ...result } = user;
    return { ...result, calculatedTargets: targets };
  }
}
