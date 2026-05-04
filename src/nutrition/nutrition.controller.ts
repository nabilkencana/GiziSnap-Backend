import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { NutritionServiceClient } from './nutrition-service.client';

@Controller('api/nutrition')
export class NutritionController {
    constructor(private nutritionClient: NutritionServiceClient) { }

    @Post('analyze')
    async analyzeNutrition(
        @Body() body: { foodName: string; quantity?: number }
    ) {
        const { foodName, quantity = 100 } = body;
        return this.nutritionClient.analyzeNutrition(foodName, quantity);
    }

    @Get('search')
    async searchFoods(@Query('q') query: string) {
        return this.nutritionClient.searchFoods(query);
    }

    @Get('foods')
    async listFoods(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20
    ) {
        return this.nutritionClient.listFoods(page, limit);
    }

    @Get('categories')
    async getCategories() {
        return this.nutritionClient.getCategories();
    }

    @Post('add')
    async addFood(
        @Body() foodData: {
            name: string;
            category: string;
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
            notes?: string;
        }
    ) {
        return this.nutritionClient.addFood(foodData);
    }

    @Get('health')
    async healthCheck() {
        return this.nutritionClient.healthCheck();
    }
}
