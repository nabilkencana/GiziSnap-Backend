import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class DailyLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(createLogDto: CreateLogDto) {
    const { userId, foodId, portion } = createLogDto;

    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) throw new NotFoundException(`Pengguna dengan ID ${userId} tidak ditemukan`);

    const foodExists = await this.prisma.food.findUnique({ where: { id: foodId } });
    if (!foodExists) throw new NotFoundException(`Makanan dengan ID ${foodId} tidak ditemukan`);

    return this.prisma.dailyLog.create({
      data: { userId, foodId, portion: portion ?? 1.0 },
      include: { food: true },
    });
  }

  async deleteLog(logId: string) {
    const log = await this.prisma.dailyLog.findUnique({ where: { id: logId } });
    if (!log) throw new NotFoundException(`Log dengan ID ${logId} tidak ditemukan`);
    return this.prisma.dailyLog.delete({ where: { id: logId } });
  }

  async getTodayLogs(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const logs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
      include: { food: true },
      orderBy: { createdAt: 'asc' },
    });

    const macros = logs.reduce(
      (acc, log) => {
        if (log.food) {
          acc.totalCalories += log.food.calories * log.portion;
          acc.totalProtein  += log.food.protein  * log.portion;
          acc.totalCarbs    += log.food.carbs    * log.portion;
          acc.totalFat      += log.food.fat      * log.portion;
        }
        return acc;
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    );

    return {
      userId,
      tanggal: new Date().toISOString().split('T')[0],
      macros,
      logs,
    };
  }

  async getWeeklyLogs(userId: string) {
    const result = [];
    
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const logs = await this.prisma.dailyLog.findMany({
      where: { userId, createdAt: { gte: start, lte: end } },
      include: { food: true },
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const dailyLogs = logs.filter(
        (log) => log.createdAt.toISOString().split('T')[0] === dateString
      );

      const totalCalories = dailyLogs.reduce(
        (sum, log) => sum + (log.food ? log.food.calories * log.portion : 0), 0
      );

      result.push({
        date: dateString,
        label: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()],
        totalCalories: Math.round(totalCalories),
        isToday: i === 0,
      });
    }
    
    return result;
  }

  async getRecommendations(userId: string, goal: string) {
    // ── 1. Ambil log hari ini ──────────────────────────────────────────────
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999);

    const todayLogs = await this.prisma.dailyLog.findMany({
      where: { userId, createdAt: { gte: todayStart, lte: todayEnd } },
      include: { food: true },
    });

    // Hitung total nutrisi hari ini
    const consumed = todayLogs.reduce(
      (acc, log) => {
        if (log.food) {
          acc.calories += log.food.calories * log.portion;
          acc.protein  += log.food.protein  * log.portion;
          acc.carbs    += log.food.carbs    * log.portion;
          acc.fat      += log.food.fat      * log.portion;
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    // ID makanan yang sudah dimakan hari ini (jangan rekomendasikan ulang)
    const consumedFoodIds = new Set(todayLogs.map(l => l.foodId));

    // ── 2. Target berdasarkan goal ─────────────────────────────────────────
    const TARGET: Record<string, { cal: number; protein: number; carbs: number; fat: number }> = {
      WEIGHT_LOSS:   { cal: 1500, protein: 90,  carbs: 150, fat: 45 },
      DIABETES_CARE: { cal: 1800, protein: 80,  carbs: 130, fat: 60 },
      BODYBUILDING:  { cal: 2800, protein: 185, carbs: 280, fat: 70 },
    };
    // Normalise goal string
    const goalKey = goal?.toUpperCase().replace('-', '_').replace(' ', '_');
    const target = TARGET[goalKey] ?? TARGET['WEIGHT_LOSS'];

    const deficit = {
      calories: Math.max(target.cal     - consumed.calories, 0),
      protein:  Math.max(target.protein - consumed.protein,  0),
      carbs:    Math.max(target.carbs   - consumed.carbs,    0),
      fat:      Math.max(target.fat     - consumed.fat,      0),
    };

    // ── 3. Filter makanan dari DB berdasarkan goal ─────────────────────────
    type FoodFilter = { calories?: { lte: number }; protein?: { gte: number }; carbs?: { lte: number } };
    let where: FoodFilter = {};

    if (goalKey === 'WEIGHT_LOSS') {
      where = { calories: { lte: 300 }, protein: { gte: 5 } };
    } else if (goalKey === 'DIABETES_CARE') {
      where = { carbs: { lte: 25 } };
    } else if (goalKey === 'BODYBUILDING') {
      where = { protein: { gte: 10 } };
    }

    const allFoods = await this.prisma.food.findMany({
      where,
      orderBy: [{ isVerified: 'desc' }, { upvotes: 'desc' }],
      take: 80,
    });

    // ── 4. Scoring & filter ────────────────────────────────────────────────
    const scored = allFoods
      .filter(f => !consumedFoodIds.has(f.id))
      .map(f => {
        let score = 0;
        let reasons: string[] = [];

        if (goalKey === 'WEIGHT_LOSS') {
          // Skor lebih tinggi jika kalori rendah & protein tinggi
          score += Math.max(0, 300 - f.calories) / 3;
          score += f.protein * 3;
          score -= f.fat * 1.5;
          if (f.calories < 150) reasons.push('Kalori sangat rendah');
          if (f.protein >= 10)  reasons.push('Tinggi protein');
          if (f.fat < 5)        reasons.push('Rendah lemak');
        } else if (goalKey === 'DIABETES_CARE') {
          score += Math.max(0, 25 - f.carbs) * 4;
          score += f.protein * 2;
          score -= f.fat * 1;
          if (f.carbs <= 10)   reasons.push('Karbo sangat rendah');
          if (f.carbs <= 20)   reasons.push('Aman untuk gula darah');
          if (f.protein >= 8)  reasons.push('Sumber protein baik');
        } else if (goalKey === 'BODYBUILDING') {
          score += f.protein * 5;
          score += f.calories / 10;
          score -= Math.max(0, f.fat - 20) * 2;
          if (f.protein >= 20)  reasons.push('Protein sangat tinggi');
          if (f.protein >= 10)  reasons.push('Mendukung massa otot');
          if (f.calories >= 200) reasons.push('Kalori cukup untuk bulking');
        }

        // Bonus jika mengisi defisit
        if (deficit.protein > 20 && f.protein >= 10)  { score += 15; reasons.push('Bantu kejar target protein'); }
        if (deficit.calories > 300 && f.calories > 0) { score += 8; }
        if (deficit.carbs > 50 && f.carbs >= 20)      { score += 5; }

        // Deduplicate reasons, max 2
        const uniqueReasons = [...new Set(reasons)].slice(0, 2);

        return { food: f, score, reason: uniqueReasons.join(' · ') || 'Cocok untuk kondisimu hari ini' };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return {
      consumed: {
        calories: Math.round(consumed.calories),
        protein:  Math.round(consumed.protein),
        carbs:    Math.round(consumed.carbs),
        fat:      Math.round(consumed.fat),
      },
      target,
      deficit: {
        calories: Math.round(deficit.calories),
        protein:  Math.round(deficit.protein),
        carbs:    Math.round(deficit.carbs),
        fat:      Math.round(deficit.fat),
      },
      recommendations: scored.map(s => ({
        food:   s.food,
        score:  Math.round(s.score),
        reason: s.reason,
      })),
    };
  }
}

