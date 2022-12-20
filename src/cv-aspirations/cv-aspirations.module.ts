import { Module } from '@nestjs/common';
import { CvAspirationsController } from './cv-aspirations.controller';
import { CvAspirationsService } from './cv-aspirations.service';

@Module({
  controllers: [CvAspirationsController],
  providers: [CvAspirationsService]
})
export class CvAspirationsModule {}
