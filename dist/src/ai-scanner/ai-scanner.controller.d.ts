import { AiScannerService } from './ai-scanner.service';
import { ScanImageDto } from './dto/scan-image.dto';
export declare class AiScannerController {
    private readonly aiScannerService;
    constructor(aiScannerService: AiScannerService);
    scan(scanImageDto: ScanImageDto): Promise<{
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
                id: string;
                name: string;
                calories: number;
                protein: number;
                carbs: number;
                fat: number;
                imageUrl: string | null;
                isVerified: boolean;
                upvotes: number;
                userId: string | null;
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
