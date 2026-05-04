import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';

@Module({
  imports: [MulterModule.register({ dest: 'uploads/foods' })],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService],
})
export class FoodsModule {}

