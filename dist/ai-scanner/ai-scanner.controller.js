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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiScannerController = void 0;
const common_1 = require("@nestjs/common");
const ai_scanner_service_1 = require("./ai-scanner.service");
const scan_image_dto_1 = require("./dto/scan-image.dto");
let AiScannerController = class AiScannerController {
    aiScannerService;
    constructor(aiScannerService) {
        this.aiScannerService = aiScannerService;
    }
    async scan(scanImageDto) {
        return this.aiScannerService.scanAndIdentify(scanImageDto.image);
    }
};
exports.AiScannerController = AiScannerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scan_image_dto_1.ScanImageDto]),
    __metadata("design:returntype", Promise)
], AiScannerController.prototype, "scan", null);
exports.AiScannerController = AiScannerController = __decorate([
    (0, common_1.Controller)('api/scan'),
    __metadata("design:paramtypes", [ai_scanner_service_1.AiScannerService])
], AiScannerController);
//# sourceMappingURL=ai-scanner.controller.js.map