import { Module } from '@nestjs/common';
import { NutritionController } from './nutrition.controller';
import { NutritionServiceClient } from './nutrition-service.client';

@Module({
    controllers: [NutritionController],
    providers: [NutritionServiceClient],
    exports: [NutritionServiceClient],
})
export class NutritionModule { }
