import { ProjectEntity } from './../project/entities/project.entity/project.entity';
import { UserEntity } from './../user/entites/user.entity/user.entity';
import { ProjectUserService } from './project-user.service';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('project-user')
export class ProjectUserController {
    constructor(private projectUserService: ProjectUserService) { }

    @Get()
    findAll() {
        return this.projectUserService.findAll();
    }

    

}


