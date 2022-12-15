import { CvCompetenceEntity } from './entities/cv-competence.entity/cv-competence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CvCompetenceController } from './cv-competence.controller';
import { CvCompetenceService } from './cv-competence.service';

@Module({
  imports: [TypeOrmModule.forFeature([CvCompetenceEntity])],
  controllers: [CvCompetenceController],
  providers: [CvCompetenceService]
})
export class CvCompetenceModule {}
