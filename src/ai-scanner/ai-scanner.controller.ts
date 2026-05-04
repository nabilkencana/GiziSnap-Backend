import { Controller, Post, Body } from '@nestjs/common';
import { AiScannerService } from './ai-scanner.service';
import { ScanImageDto } from './dto/scan-image.dto';

@Controller('api/scan')
export class AiScannerController {
  constructor(private readonly aiScannerService: AiScannerService) {}

  @Post()
  async scan(@Body() scanImageDto: ScanImageDto) {
    return this.aiScannerService.scanAndIdentify(scanImageDto.image);
  }
}
