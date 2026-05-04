import {
  Controller, Post, Body, Get, Query, Param, Patch,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';

// Ensure uploads folder exists on startup
const UPLOAD_DIR = 'uploads/foods';
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

@Controller('api/foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  async create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  /** Upload a food image → returns { imageUrl: '/uploads/foods/xxx.jpg' } */
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (
          _req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, accept: boolean) => void,
      ) => {
        const allowed = /\.(jpeg|jpg|png|webp|gif)$/i;
        cb(null, allowed.test(extname(file.originalname)));
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: `/uploads/foods/${file.filename}` };
  }

  @Get()
  async findAll(@Query('search') search?: string, @Query('category') category?: string) {
    return this.foodsService.findAll(search, category);
  }

  @Get('search')
  async search(@Query('name') name: string) {
    return this.foodsService.search(name);
  }

  @Patch(':id/upvote')
  async upvote(@Param('id') id: string) {
    return this.foodsService.upvote(id);
  }
}
