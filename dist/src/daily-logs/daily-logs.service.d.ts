import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';
export declare class DailyLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLog(createLogDto: CreateLogDto): Promise<{
        food: {
            id: string;
            name: string;
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
            imageUrl: string | null;
            isVerified: boolean;
            upvotes: number;
            userId: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        foodId: string;
        portion: number;
    }>;
    deleteLog(logId: string): Promise<{
        id: string;
        userId: string;
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
                id: string;
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                imageUrl: string | null;
                isVerified: boolean;
                upvotes: number;
                userId: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            userId: string;
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
