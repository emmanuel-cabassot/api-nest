import { UserEntity } from './../user/entites/user.entity/user.entity';
import { ProjectEntity } from './../project/entities/project.entity/project.entity';
import { projectUserEntity } from './entities/project-user.entity/project-user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectUserService {
    constructor(
        @InjectRepository(projectUserEntity)
        private projectUserRepository: Repository<projectUserEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async findAll(): Promise<projectUserEntity[]> {
        return await this.projectUserRepository.find();
    }


}
