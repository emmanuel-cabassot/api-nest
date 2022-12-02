import { ProjectService } from './project.service';
import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe, Delete } from '@nestjs/common';
import { ProjectEntity } from './entities/project.entity/project.entity';
import { AddProjectDto } from './dto/add-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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

    @Get()
    findAllProject(): Promise<ProjectEntity[]> {
        return this.projectService.findAllProject();
    }

    @Get(':id')
    findOneProject(@Param() params) {
        return this.projectService.findOneProject(params.id);
    }

    @Post()
    addProject(
        @Body() addProjectDto: AddProjectDto): Promise<ProjectEntity> {
        return this.projectService.addProject(addProjectDto);
    }

    @Delete(':id')
    removeProject(@Param('id', ParseIntPipe) id) {
        return this.projectService.removeProject(id);
    }

    @Delete('deleteSoft/:id')
    deleteSoftProject(@Param('id', ParseIntPipe) id) {
        return this.projectService.deleteSoftProject(id);
    }

    @Get('restore/:id')
    restoreProject(@Param('id', ParseIntPipe) id) {
        return this.projectService.restoreProject(id);
    }

    // http://localhost:3000/project/name/nameOfProject
    @Delete('name/:name')
    deleteByName(@Param('name') name) {
        return this.projectService.deleteByName(name);
    }

    @Patch(':id')
    async updateProject(
        @Body() updateProjectDto: UpdateProjectDto,
        @Param('id', ParseIntPipe) id): Promise<ProjectEntity> {
        return await this.projectService.updateProject(id, updateProjectDto);
    }


}
