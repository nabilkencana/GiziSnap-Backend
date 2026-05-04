"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionController = void 0;
const common_1 = require("@nestjs/common");
const nutrition_service_client_1 = require("./nutrition-service.client");
let NutritionController = class NutritionController {
    nutritionClient;
    constructor(nutritionClient) {
        this.nutritionClient = nutritionClient;
    }
    async analyzeNutrition(body) {
        const { foodName, quantity = 100 } = body;
        return this.nutritionClient.analyzeNutrition(foodName, quantity);
    }
    async searchFoods(query) {
        return this.nutritionClient.searchFoods(query);
    }
    async listFoods(page = 1, limit = 20) {
        return this.nutritionClient.listFoods(page, limit);
    }
    async getCategories() {
        return this.nutritionClient.getCategories();
    }
    async addFood(foodData) {
        return this.nutritionClient.addFood(foodData);
    }
    async healthCheck() {
        return this.nutritionClient.healthCheck();
    }
};
exports.NutritionController = NutritionController;
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "analyzeNutrition", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "searchFoods", null);
__decorate([
    (0, common_1.Get)('foods'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "listFoods", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "addFood", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "healthCheck", null);
exports.NutritionController = NutritionController = __decorate([
    (0, common_1.Controller)('api/nutrition'),
    __metadata("design:paramtypes", [nutrition_service_client_1.NutritionServiceClient])
], NutritionController);
//# sourceMappingURL=nutrition.controller.js.map