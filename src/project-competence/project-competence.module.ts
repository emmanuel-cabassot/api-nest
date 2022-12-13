import { CompetenceEntity } from './../competence/entities/competence.entity/competence.entity';
import { ProjectEntity } from './../project/entities/project.entity/project.entity';
import { projectCompetenceEntity } from './../project-competence/entities/project-competence.entity/project-competence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectCompetenceController } from './project-competence.controller';
import { ProjectCompetenceService } from './project-competence.service';

@Module({
  imports: [TypeOrmModule.forFeature([projectCompetenceEntity, ProjectEntity, CompetenceEntity])],
  controllers: [ProjectCompetenceController],
  providers: [ProjectCompetenceService]
})
export class ProjectCompetenceModule {}
