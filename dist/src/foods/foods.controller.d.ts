import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
export declare class FoodsController {
    private readonly foodsService;
    constructor(foodsService: FoodsService);
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
    uploadImage(file: Express.Multer.File): Promise<{
        imageUrl: string;
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
