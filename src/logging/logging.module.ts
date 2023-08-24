import { Module } from '@nestjs/common';
import { CustomLoggingService } from './logging.service';

@Module({
  providers: [CustomLoggingService],
  exports: [CustomLoggingService],
})
export class CustomLoggingModule {}
