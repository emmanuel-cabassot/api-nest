import { UserEntity } from './../user/entites/user.entity/user.entity';
import { ProjectEntity } from './../project/entities/project.entity/project.entity';
import { projectUserEntity } from './entities/project-user.entity/project-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectUserController } from './project-user.controller';
import { ProjectUserService } from './project-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([projectUserEntity, ProjectEntity, UserEntity])],
  controllers: [ProjectUserController],
  providers: [ProjectUserService]
})
export class ProjectUserModule {}
