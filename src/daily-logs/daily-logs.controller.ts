import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service';
import { CreateLogDto } from './dto/create-log.dto';

@Controller('api/daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  @Post()
  async createLog(@Body() createLogDto: CreateLogDto) {
    return this.dailyLogsService.createLog(createLogDto);
  }

  @Delete(':id')
  async deleteLog(@Param('id') id: string) {
    return this.dailyLogsService.deleteLog(id);
  }

  @Get('today/:userId')
  async getTodayLogs(@Param('userId') userId: string) {
    return this.dailyLogsService.getTodayLogs(userId);
  }

  @Get('weekly/:userId')
  async getWeeklyLogs(@Param('userId') userId: string) {
    return this.dailyLogsService.getWeeklyLogs(userId);
  }
}
