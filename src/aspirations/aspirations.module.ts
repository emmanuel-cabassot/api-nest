import { Module } from '@nestjs/common';
import { AspirationsController } from './aspirations.controller';
import { AspirationsService } from './aspirations.service';

@Module({
  controllers: [AspirationsController],
  providers: [AspirationsService]
})
export class AspirationsModule {}
