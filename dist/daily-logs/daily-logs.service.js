"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DailyLogsService = class DailyLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLog(createLogDto) {
        const { userId, foodId, portion } = createLogDto;
        const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists)
            throw new common_1.NotFoundException(`Pengguna dengan ID ${userId} tidak ditemukan`);
        const foodExists = await this.prisma.food.findUnique({ where: { id: foodId } });
        if (!foodExists)
            throw new common_1.NotFoundException(`Makanan dengan ID ${foodId} tidak ditemukan`);
        return this.prisma.dailyLog.create({
            data: { userId, foodId, portion: portion ?? 1.0 },
            include: { food: true },
        });
    }
    async deleteLog(logId) {
        const log = await this.prisma.dailyLog.findUnique({ where: { id: logId } });
        if (!log)
            throw new common_1.NotFoundException(`Log dengan ID ${logId} tidak ditemukan`);
        return this.prisma.dailyLog.delete({ where: { id: logId } });
    }
    async getTodayLogs(userId) {
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
        const macros = logs.reduce((acc, log) => {
            if (log.food) {
                acc.totalCalories += log.food.calories * log.portion;
                acc.totalProtein += log.food.protein * log.portion;
                acc.totalCarbs += log.food.carbs * log.portion;
                acc.totalFat += log.food.fat * log.portion;
            }
            return acc;
        }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
        return {
            userId,
            tanggal: new Date().toISOString().split('T')[0],
            macros,
            logs,
        };
    }
    async getWeeklyLogs(userId) {
        const result = [];
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        const logs = await this.prisma.dailyLog.findMany({
            where: {
                userId,
                createdAt: { gte: start, lte: end }
            },
            include: { food: true },
        });
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            const dailyLogs = logs.filter((log) => log.createdAt.toISOString().split('T')[0] === dateString);
            const totalCalories = dailyLogs.reduce((sum, log) => sum + (log.food ? log.food.calories * log.portion : 0), 0);
            result.push({
                date: dateString,
                label: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()],
                totalCalories: Math.round(totalCalories),
                isToday: i === 0,
            });
        }
        return result;
    }
};
exports.DailyLogsService = DailyLogsService;
exports.DailyLogsService = DailyLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DailyLogsService);
//# sourceMappingURL=daily-logs.service.js.map