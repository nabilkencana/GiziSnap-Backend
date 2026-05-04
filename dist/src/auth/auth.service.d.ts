import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        goal: string;
        targetCalories: number;
    }>;
    login(dto: LoginDto): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        goal: string;
        targetCalories: number;
    }>;
    googleLogin(email: string, name: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        goal: string;
        targetCalories: number;
    }>;
    updateGoal(userId: string, goal: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        goal: string;
        targetCalories: number;
    }>;
}
