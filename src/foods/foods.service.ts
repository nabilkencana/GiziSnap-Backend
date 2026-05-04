import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFoodDto: CreateFoodDto) {
    const { userId, ...rest } = createFoodDto;
    return this.prisma.food.create({
      data: {
        ...rest,
        isVerified: false,
        ...(userId ? { userId } : {}),
      },
    });
  }

  async findAll(search?: string, category?: string) {
    return this.prisma.food.findMany({
      where: {
        ...(search
          ? { name: { contains: search, mode: 'insensitive' } }
          : {}),
      },
      orderBy: [{ isVerified: 'desc' }, { upvotes: 'desc' }, { createdAt: 'desc' }],
      take: 200,
    });
  }

  /** Used by AI scanner to auto-add new foods (skip if name already exists) */
  async findOrCreate(data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) {
    const existing = await this.prisma.food.findFirst({
      where: { name: { equals: data.name, mode: 'insensitive' } },
    });
    if (existing) return { food: existing, created: false };
    const created = await this.prisma.food.create({
      data: { ...data, isVerified: false },
    });
    return { food: created, created: true };
  }

  async search(name: string) {
    return this.prisma.food.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async upvote(id: string) {
    const food = await this.prisma.food.findUnique({ where: { id } });

    if (!food) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }

    const updatedUpvotes = food.upvotes + 1;
    const isVerified = updatedUpvotes > 5 ? true : food.isVerified;

    return this.prisma.food.update({
      where: { id },
      data: {
        upvotes: updatedUpvotes,
        isVerified,
      },
    });
  }
}
