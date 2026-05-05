import { PrismaService } from '../prisma/prisma.service';
export declare class AiScannerService {
    private readonly prisma;
    private readonly apiKey;
    private readonly baseUrl;
    private readonly CANDIDATE_MODELS;
    constructor(prisma: PrismaService);
    private parseImagePayload;
    private urlToBase64;
    private findFoodInDb;
    scanAndIdentify(image: string): Promise<{
        detectedName: string;
        foods: never[];
        message: string;
        totals?: undefined;
        autoAdded?: undefined;
        notInDatabase?: undefined;
    } | {
        detectedName: string;
        foods: {
            detectedName: string;
            portion: string;
            confidence: number;
            food: {
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                imageUrl: string | null;
                userId: string | null;
                id: string;
                isVerified: boolean;
                upvotes: number;
                createdAt: Date;
            } | null;
            inDatabase: boolean;
            autoAdded: boolean;
        }[];
        totals: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
        autoAdded: string[];
        notInDatabase: string[];
        message: string;
    }>;
}
