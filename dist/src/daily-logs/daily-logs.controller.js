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
exports.DailyLogsController = void 0;
const common_1 = require("@nestjs/common");
const daily_logs_service_1 = require("./daily-logs.service");
const create_log_dto_1 = require("./dto/create-log.dto");
let DailyLogsController = class DailyLogsController {
    dailyLogsService;
    constructor(dailyLogsService) {
        this.dailyLogsService = dailyLogsService;
    }
    async createLog(createLogDto) {
        return this.dailyLogsService.createLog(createLogDto);
    }
    async deleteLog(id) {
        return this.dailyLogsService.deleteLog(id);
    }
    async getTodayLogs(userId) {
        return this.dailyLogsService.getTodayLogs(userId);
    }
    async getWeeklyLogs(userId) {
        return this.dailyLogsService.getWeeklyLogs(userId);
    }
};
exports.DailyLogsController = DailyLogsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_log_dto_1.CreateLogDto]),
    __metadata("design:returntype", Promise)
], DailyLogsController.prototype, "createLog", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyLogsController.prototype, "deleteLog", null);
__decorate([
    (0, common_1.Get)('today/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyLogsController.prototype, "getTodayLogs", null);
__decorate([
    (0, common_1.Get)('weekly/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyLogsController.prototype, "getWeeklyLogs", null);
exports.DailyLogsController = DailyLogsController = __decorate([
    (0, common_1.Controller)('api/daily-logs'),
    __metadata("design:paramtypes", [daily_logs_service_1.DailyLogsService])
], DailyLogsController);
//# sourceMappingURL=daily-logs.controller.js.map