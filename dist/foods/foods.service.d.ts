import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
export declare class FoodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createFoodDto: CreateFoodDto): Promise<{
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
    }>;
    findAll(search?: string, category?: string): Promise<{
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
    }[]>;
    findOrCreate(data: {
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }): Promise<{
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
        created: boolean;
    }>;
    search(name: string): Promise<{
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
    }[]>;
    upvote(id: string): Promise<{
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
    }>;
}
