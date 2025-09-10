import { Module } from '@nestjs/common';
import { DateService } from './dates.service';

@Module({
  imports: [],
  providers: [DateService],
  exports: [DateService]
})
export class UtilsModule {}
