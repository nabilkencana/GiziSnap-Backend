import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';
export declare class DailyLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLog(createLogDto: CreateLogDto): Promise<{
        food: {
            name: string;
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
            imageUrl: string | null;
            userId: string | null;
            id: string;
            isVerified: boolean;
            upvotes: number;
            createdAt: Date;
        };
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        foodId: string;
        portion: number;
    }>;
    deleteLog(logId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        foodId: string;
        portion: number;
    }>;
    getTodayLogs(userId: string): Promise<{
        userId: string;
        tanggal: string;
        macros: {
            totalCalories: number;
            totalProtein: number;
            totalCarbs: number;
            totalFat: number;
        };
        logs: ({
            food: {
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                imageUrl: string | null;
                userId: string | null;
                id: string;
                isVerified: boolean;
                upvotes: number;
                createdAt: Date;
            };
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            foodId: string;
            portion: number;
        })[];
    }>;
    getWeeklyLogs(userId: string): Promise<{
        date: string;
        label: string;
        totalCalories: number;
        isToday: boolean;
    }[]>;
}
