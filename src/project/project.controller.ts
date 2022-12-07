import { AccessTokenGuard } from './../user/guards/access-token.guard';
import { UserEntity } from './../user/entites/user.entity/user.entity';
import { ProjectService } from './project.service';
import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectEntity } from './entities/project.entity/project.entity';
import { AddProjectDto } from './dto/add-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';

@Controller('project')
export class ProjectController {
    constructor(private projectService: ProjectService) { }
    
    @Get('stats/:minAge/:maxAge')
    async getStatsByAge(@Param('minAge', ParseIntPipe) minAge, @Param('maxAge', ParseIntPipe) maxAge): Promise<ProjectEntity[]> {
        return await this.projectService.projectStatsByAge(minAge, maxAge);
    }

    @Get('age/:age')
    async searchProjectByAge(@Param('age', ParseIntPipe) age): Promise<ProjectEntity[]> {
        return await this.projectService.projectByAge(age);
    }

    @Get(':id')
    findOneProject(@Param() params) {
        return this.projectService.findOneProject(params.id);
    }
    @Get('restore/:id')
    @UseGuards(AccessTokenGuard)
    restoreProject(@Param('id', ParseIntPipe) id) {
        return this.projectService.restoreProject(id);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    async findAllProject(
        @User() user: UserEntity
    ): Promise<ProjectEntity[]> {
        
        return await this.projectService.findAllProject(user);
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    addProject(
        @Body() addProjectDto: AddProjectDto,
        // @Req() va récupérer les infos qui sont renvoyées par la méthode validate de la classe JwtStrategy(jwt-strategy.ts)
        @Req() request: Request
    ) {
        const user = request.user;
        return this.projectService.addProject(addProjectDto, user);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    removeProject(@Param('id', ParseIntPipe) id) {
        return this.projectService.removeProject(id);
    }

    @Delete('deleteSoft/:id')
    @UseGuards(AccessTokenGuard)
    deleteSoftProject(@Param('id', ParseIntPipe) id) {
        return this.projectService.deleteSoftProject(id);
    }

    // http://localhost:3000/project/name/nameOfProject
    @Delete('name/:name')
    @UseGuards(AccessTokenGuard)
    deleteByName(@Param('name') name) {
        return this.projectService.deleteByName(name);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    async updateProject(
        @Body() updateProjectDto: UpdateProjectDto,
        @Param('id', ParseIntPipe) id): Promise<ProjectEntity> {
        return await this.projectService.updateProject(id, updateProjectDto);
    }


}
