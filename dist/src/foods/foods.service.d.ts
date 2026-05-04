import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
export declare class FoodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createFoodDto: CreateFoodDto): Promise<{
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
    }>;
    findAll(search?: string, category?: string): Promise<{
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
    }[]>;
    findOrCreate(data: {
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    }): Promise<{
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
        created: boolean;
    }>;
    search(name: string): Promise<{
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
    }[]>;
    upvote(id: string): Promise<{
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
    }>;
}
