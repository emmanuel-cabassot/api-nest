import { CompetenceEntity } from './../competence/entities/competence.entity/competence.entity';
import { CvEntity } from './../cv/entities/cv.entitiy/cv.entity';
import { CvCompetenceEntity } from './entities/cv-competence.entity/cv-competence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CvCompetenceController } from './cv-competence.controller';
import { CvCompetenceService } from './cv-competence.service';

@Module({
  imports: [TypeOrmModule.forFeature([CvCompetenceEntity, CvEntity, CompetenceEntity])],
  controllers: [CvCompetenceController],
  providers: [CvCompetenceService]
})
export class CvCompetenceModule {}
