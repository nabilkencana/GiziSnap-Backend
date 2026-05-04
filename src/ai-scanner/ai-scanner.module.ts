import { Module } from '@nestjs/common';
import { AiScannerService } from './ai-scanner.service';
import { AiScannerController } from './ai-scanner.controller';

@Module({
  controllers: [AiScannerController],
  providers: [AiScannerService],
})
export class AiScannerModule {}
