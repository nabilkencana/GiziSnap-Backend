import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    google(dto: {
        email: string;
        name: string;
    }): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        goal: string;
        targetCalories: number;
    }>;
    updateGoal(dto: {
        goal: string;
    }, userId: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        goal: string;
        targetCalories: number;
    }>;
}
