import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FoodsModule } from './foods/foods.module';
import { AiScannerModule } from './ai-scanner/ai-scanner.module';
import { DailyLogsModule } from './daily-logs/daily-logs.module';
import { AuthModule } from './auth/auth.module';
import { NutritionModule } from './nutrition/nutrition.module';

@Module({
  imports: [
    PrismaModule,
    FoodsModule,
    AiScannerModule,
    DailyLogsModule,
    AuthModule,
    NutritionModule,
  ],
})
export class AppModule { }

