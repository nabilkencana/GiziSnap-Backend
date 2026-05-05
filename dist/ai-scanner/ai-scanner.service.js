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
exports.AiScannerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiScannerService = class AiScannerService {
    prisma;
    apiKey = process.env.GEMINI_API_KEY || '';
    baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    CANDIDATE_MODELS = [
        'models/gemini-2.5-flash',
        'models/gemini-2.5-pro',
        'models/gemini-2.0-flash',
        'models/gemini-2.0-flash-lite',
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-flash-latest',
    ];
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseImagePayload(image) {
        if (image.startsWith('data:image')) {
            const [header, data] = image.split(',');
            const mimeType = header.split(':')[1].split(';')[0];
            return { data, mimeType };
        }
        return { url: image };
    }
    async urlToBase64(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = (response.headers.get('content-type') || 'image/jpeg').split(';')[0];
        return { data: buffer.toString('base64'), mimeType };
    }
    async findFoodInDb(name) {
        const clean = name.trim();
        const firstWord = clean.split(' ')[0];
        const exact = await this.prisma.food.findFirst({
            where: { name: { equals: clean, mode: 'insensitive' } },
        });
        if (exact)
            return exact;
        const full = await this.prisma.food.findFirst({
            where: { name: { contains: clean, mode: 'insensitive' } },
        });
        if (full)
            return full;
        const partial = await this.prisma.food.findFirst({
            where: { name: { contains: firstWord, mode: 'insensitive' } },
        });
        return partial ?? null;
    }
    async scanAndIdentify(image) {
        try {
            if (!this.apiKey) {
                throw new Error('GEMINI_API_KEY belum diset di .env');
            }
            console.log('[Gemini] API Key prefix:', this.apiKey.substring(0, 10) + '...');
            let inlineData;
            const parsed = this.parseImagePayload(image);
            if ('data' in parsed) {
                inlineData = parsed;
            }
            else {
                inlineData = await this.urlToBase64(parsed.url);
            }
            const prompt = `Kamu adalah ahli gizi Indonesia. Lihat foto ini dan identifikasi SEMUA item makanan DAN minuman yang terlihat, termasuk yang ada di dalam kotak bekal, piring, bungkus plastik, atau mangkuk.

Kembalikan jawaban HANYA dalam format JSON array berikut (tanpa markdown, tanpa kode blok):
[
  {
    "name": "Nama Item",
    "portion": "deskripsi porsi (misal: 1 porsi, setengah mangkuk)",
    "confidence": 0.95,
    "est_calories": 150,
    "est_protein": 5.0,
    "est_carbs": 20.0,
    "est_fat": 3.0
  }
]

Aturan:
- Deteksi SEMUA komponen makanan terpisah: nasi, lauk pauk (ayam, tempe, telur, dll), sayuran, buah, makanan ringan, dan minuman.
- Perhatikan baik-baik makanan di dalam kotak bekal / wadah makan. Jangan abaikan lauk pauk atau sayuran.
- Gunakan nama bahasa Indonesia yang umum (contoh: "Nasi Putih", "Ayam Goreng", "Sayur Bayam").
- est_calories, est_protein, est_carbs, est_fat = estimasi nutrisi untuk porsi yang terlihat (wajib angka, jangan null).
- confidence adalah angka antara 0.0 sampai 1.0 yang menunjukkan seberapa yakin kamu.
- Jika foto SAMA SEKALI BUKAN makanan/minuman, barulah kembalikan []. Jika ragu tapi masih mirip makanan, tebaklah sebagai item makanan terdekat.
- Maksimal 10 item.
- Output HANYA JSON array saja, murni JSON tanpa embel-embel apapun.`;
            const requestBody = {
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: inlineData.mimeType,
                                    data: inlineData.data,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
            };
            let rawText = '';
            let usedModel = '';
            for (const modelPath of this.CANDIDATE_MODELS) {
                const url = `${this.baseUrl}/${modelPath}:generateContent?key=${this.apiKey}`;
                console.log(`[Gemini] Trying: ${modelPath}...`);
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
                    });
                    const body = await response.json();
                    if (response.status === 404) {
                        console.log(`[Gemini] 404 - model tidak tersedia: ${modelPath}`);
                        continue;
                    }
                    if (response.status === 429) {
                        const msg = body?.error?.message ?? '';
                        if (msg.includes('limit: 0') || msg.includes('quota')) {
                            console.log(`[Gemini] 429 (no access/quota, skip): ${modelPath}`);
                            continue;
                        }
                        console.log(`[Gemini] 429 rate limit on ${modelPath}, retrying in 5s...`);
                        await new Promise((r) => setTimeout(r, 5000));
                        const retryResp = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(requestBody),
                        });
                        if (retryResp.ok) {
                            const retryBody = await retryResp.json();
                            rawText = retryBody?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                            if (rawText) {
                                usedModel = modelPath;
                                break;
                            }
                        }
                        continue;
                    }
                    if (!response.ok) {
                        console.log(`[Gemini] Error ${response.status} on ${modelPath}:`, body?.error?.message);
                        continue;
                    }
                    rawText = body?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                    usedModel = modelPath;
                    console.log(`[Gemini] ✓ Success with: ${modelPath}`);
                    break;
                }
                catch (fetchErr) {
                    console.log(`[Gemini] Fetch error on ${modelPath}:`, fetchErr);
                    continue;
                }
            }
            if (!rawText) {
                throw new Error('Semua model Gemini tidak tersedia. Pastikan GEMINI_API_KEY valid dan project memiliki akses ke Gemini API.');
            }
            console.log(`[Gemini] Raw response (${usedModel}):`, rawText.substring(0, 200));
            let detectedItems = [];
            try {
                let cleaned = rawText
                    .replace(/```json\n?/gi, '')
                    .replace(/```\n?/g, '')
                    .trim();
                try {
                    const parsed = JSON.parse(cleaned);
                    detectedItems = Array.isArray(parsed) ? parsed : [];
                }
                catch {
                    console.warn('[Gemini] Full parse failed, attempting partial recovery...');
                    const objectMatches = cleaned.match(/\{[^{}]*\}/g) ?? [];
                    for (const chunk of objectMatches) {
                        try {
                            const obj = JSON.parse(chunk);
                            if (obj && typeof obj.name === 'string')
                                detectedItems.push(obj);
                        }
                        catch { }
                    }
                    if (detectedItems.length > 0) {
                        console.log(`[Gemini] Recovered ${detectedItems.length} item(s) from partial JSON`);
                    }
                    else {
                        console.error('[Gemini] Recovery failed. Raw:', rawText.substring(0, 300));
                    }
                }
            }
            catch (outerErr) {
                console.error('[Gemini] JSON parse outer error:', outerErr);
                detectedItems = [];
            }
            if (detectedItems.length === 0) {
                return {
                    detectedName: 'Tidak terdeteksi',
                    foods: [],
                    message: 'Tidak ada makanan/minuman yang terdeteksi. Pastikan foto memperlihatkan item dengan jelas.',
                };
            }
            const foods = [];
            for (const item of detectedItems) {
                let dbFood = await this.findFoodInDb(item.name);
                let autoAdded = false;
                if (!dbFood) {
                    try {
                        dbFood = await this.prisma.food.create({
                            data: {
                                name: item.name,
                                calories: item.est_calories ?? 0,
                                protein: item.est_protein ?? 0,
                                carbs: item.est_carbs ?? 0,
                                fat: item.est_fat ?? 0,
                                isVerified: false,
                            },
                        });
                        autoAdded = true;
                        console.log(`[Gemini] ✚ Auto-added to DB: "${item.name}" (${item.est_calories} kcal est.)`);
                    }
                    catch (createErr) {
                        console.error(`[Gemini] Failed to auto-add "${item.name}":`, createErr);
                        dbFood = null;
                    }
                }
                foods.push({
                    detectedName: item.name,
                    portion: item.portion,
                    confidence: item.confidence,
                    food: dbFood ?? null,
                    inDatabase: !!dbFood && !autoAdded,
                    autoAdded,
                });
            }
            const totals = foods
                .filter((f) => f.food)
                .reduce((acc, f) => ({
                calories: acc.calories + (f.food?.calories ?? 0),
                protein: acc.protein + (f.food?.protein ?? 0),
                carbs: acc.carbs + (f.food?.carbs ?? 0),
                fat: acc.fat + (f.food?.fat ?? 0),
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
            const autoAdded = foods.filter((f) => f.autoAdded).map((f) => f.detectedName);
            const stillMissing = foods.filter((f) => !f.food).map((f) => f.detectedName);
            console.log(`[Gemini] ✓ Detected ${foods.length} item(s):`, foods.map((f) => f.detectedName).join(', '));
            if (autoAdded.length)
                console.log(`[Gemini] ✚ Auto-added: ${autoAdded.join(', ')}`);
            return {
                detectedName: foods.map((f) => f.detectedName).join(', '),
                foods,
                totals,
                autoAdded,
                notInDatabase: stillMissing,
                message: autoAdded.length > 0
                    ? `✓ Terdeteksi ${foods.length} item. "${autoAdded.join(', ')}" otomatis ditambahkan ke database (estimasi AI).`
                    : `✓ Terdeteksi ${foods.length} item, semua sudah ada di database!`,
            };
        }
        catch (err) {
            console.error('[Scanner] Gemini error:', err?.message ?? err);
            return {
                detectedName: 'Error',
                foods: [],
                message: `Gagal menganalisis: ${err?.message ?? 'Unknown error'}`,
            };
        }
    }
};
exports.AiScannerService = AiScannerService;
exports.AiScannerService = AiScannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiScannerService);
//# sourceMappingURL=ai-scanner.service.js.map