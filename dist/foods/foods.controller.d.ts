import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
export declare class FoodsController {
    private readonly foodsService;
    constructor(foodsService: FoodsService);
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
    uploadImage(file: Express.Multer.File): Promise<{
        imageUrl: string;
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
