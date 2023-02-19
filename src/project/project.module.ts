import { projectCompetenceEntity } from './../project-competence/entities/project-competence.entity/project-competence.entity';
import { CompetenceEntity } from './../competence/entities/competence.entity/competence.entity';
import { projectUserEntity } from './../project-user/entities/project-user.entity/project-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectEntity } from "./entities/project.entity/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, projectCompetenceEntity, CompetenceEntity, projectUserEntity])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
