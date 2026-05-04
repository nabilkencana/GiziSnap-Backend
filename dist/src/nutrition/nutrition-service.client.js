"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionServiceClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let NutritionServiceClient = class NutritionServiceClient {
    nutritionServiceUrl = process.env.NUTRITION_SERVICE_URL || 'http://localhost:5000';
    async analyzeNutrition(foodName, quantity = 100) {
        try {
            const response = await axios_1.default.post(`${this.nutritionServiceUrl}/api/nutrition/analyze`, {
                foodName,
                quantity,
            });
            return response.data;
        }
        catch (error) {
            console.error('Nutrition service error:', error.message);
            throw new Error(`Failed to analyze nutrition for "${foodName}"`);
        }
    }
    async searchFoods(query) {
        try {
            const response = await axios_1.default.get(`${this.nutritionServiceUrl}/api/nutrition/search`, {
                params: { q: query },
            });
            return response.data;
        }
        catch (error) {
            console.error('Nutrition service search error:', error.message);
            throw new Error('Failed to search foods');
        }
    }
    async listFoods(page = 1, limit = 20) {
        try {
            const response = await axios_1.default.get(`${this.nutritionServiceUrl}/api/nutrition/foods`, {
                params: { page, limit },
            });
            return response.data;
        }
        catch (error) {
            console.error('Nutrition service list error:', error.message);
            throw new Error('Failed to list foods');
        }
    }
    async getCategories() {
        try {
            const response = await axios_1.default.get(`${this.nutritionServiceUrl}/api/nutrition/categories`);
            return response.data;
        }
        catch (error) {
            console.error('Nutrition service categories error:', error.message);
            throw new Error('Failed to get categories');
        }
    }
    async addFood(foodData) {
        try {
            const response = await axios_1.default.post(`${this.nutritionServiceUrl}/api/nutrition/add`, foodData);
            return response.data;
        }
        catch (error) {
            console.error('Nutrition service add error:', error.message);
            throw new Error('Failed to add food');
        }
    }
    async healthCheck() {
        try {
            const response = await axios_1.default.get(`${this.nutritionServiceUrl}/health`);
            return response.data;
        }
        catch (error) {
            console.error('Nutrition service health check failed:', error.message);
            return { status: 'down', error: error.message };
        }
    }
};
exports.NutritionServiceClient = NutritionServiceClient;
exports.NutritionServiceClient = NutritionServiceClient = __decorate([
    (0, common_1.Injectable)()
], NutritionServiceClient);
//# sourceMappingURL=nutrition-service.client.js.map