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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FoodsService = class FoodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFoodDto) {
        const { userId, ...rest } = createFoodDto;
        return this.prisma.food.create({
            data: {
                ...rest,
                isVerified: false,
                ...(userId ? { userId } : {}),
            },
        });
    }
    async findAll(search, category) {
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
    async findOrCreate(data) {
        const existing = await this.prisma.food.findFirst({
            where: { name: { equals: data.name, mode: 'insensitive' } },
        });
        if (existing)
            return { food: existing, created: false };
        const created = await this.prisma.food.create({
            data: { ...data, isVerified: false },
        });
        return { food: created, created: true };
    }
    async search(name) {
        return this.prisma.food.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
        });
    }
    async upvote(id) {
        const food = await this.prisma.food.findUnique({ where: { id } });
        if (!food) {
            throw new common_1.NotFoundException(`Food with ID ${id} not found`);
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
};
exports.FoodsService = FoodsService;
exports.FoodsService = FoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodsService);
//# sourceMappingURL=foods.service.js.map