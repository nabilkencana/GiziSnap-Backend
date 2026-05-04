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
    
    // Tentukan rentang waktu 7 hari ke belakang (mulai dari 00:00 hari ke-6 hingga 23:59 hari ini)
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    // Fetch SEMUA logs dalam waktu 7 hari terakhir HANYA dengan 1 QUERY
    const logs = await this.prisma.dailyLog.findMany({
      where: { 
        userId, 
        createdAt: { gte: start, lte: end } 
      },
      include: { food: true },
    });

    // Kelompokkan hasil query ke hari masing-masing
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
}
