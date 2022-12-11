import { projectCompetenceEntity } from './entities/project-competence.entity/project-competence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectEntity } from "./entities/project.entity/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, projectCompetenceEntity])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
