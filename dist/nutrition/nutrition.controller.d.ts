import { NutritionServiceClient } from './nutrition-service.client';
export declare class NutritionController {
    private nutritionClient;
    constructor(nutritionClient: NutritionServiceClient);
    analyzeNutrition(body: {
        foodName: string;
        quantity?: number;
    }): Promise<any>;
    searchFoods(query: string): Promise<any>;
    listFoods(page?: number, limit?: number): Promise<any>;
    getCategories(): Promise<any>;
    addFood(foodData: {
        name: string;
        category: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        notes?: string;
    }): Promise<any>;
    healthCheck(): Promise<any>;
}
