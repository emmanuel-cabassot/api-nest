import { CvEntity } from './entities/cv.entitiy/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';

@Module({
  imports: [TypeOrmModule.forFeature([CvEntity])],
  controllers: [CvController],
  providers: [CvService]
})
export class CvModule {}
