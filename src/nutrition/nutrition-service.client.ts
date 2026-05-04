import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NutritionServiceClient {
    private nutritionServiceUrl = process.env.NUTRITION_SERVICE_URL || 'http://localhost:5000';

    async analyzeNutrition(foodName: string, quantity: number = 100) {
        try {
            const response = await axios.post(
                `${this.nutritionServiceUrl}/api/nutrition/analyze`,
                {
                    foodName,
                    quantity,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Nutrition service error:', error.message);
            throw new Error(`Failed to analyze nutrition for "${foodName}"`);
        }
    }

    async searchFoods(query: string) {
        try {
            const response = await axios.get(
                `${this.nutritionServiceUrl}/api/nutrition/search`,
                {
                    params: { q: query },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Nutrition service search error:', error.message);
            throw new Error('Failed to search foods');
        }
    }

    async listFoods(page: number = 1, limit: number = 20) {
        try {
            const response = await axios.get(
                `${this.nutritionServiceUrl}/api/nutrition/foods`,
                {
                    params: { page, limit },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Nutrition service list error:', error.message);
            throw new Error('Failed to list foods');
        }
    }

    async getCategories() {
        try {
            const response = await axios.get(
                `${this.nutritionServiceUrl}/api/nutrition/categories`
            );
            return response.data;
        } catch (error) {
            console.error('Nutrition service categories error:', error.message);
            throw new Error('Failed to get categories');
        }
    }

    async addFood(foodData: {
        name: string;
        category: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        notes?: string;
    }) {
        try {
            const response = await axios.post(
                `${this.nutritionServiceUrl}/api/nutrition/add`,
                foodData
            );
            return response.data;
        } catch (error) {
            console.error('Nutrition service add error:', error.message);
            throw new Error('Failed to add food');
        }
    }

    async healthCheck() {
        try {
            const response = await axios.get(
                `${this.nutritionServiceUrl}/health`
            );
            return response.data;
        } catch (error) {
            console.error('Nutrition service health check failed:', error.message);
            return { status: 'down', error: error.message };
        }
    }
}
