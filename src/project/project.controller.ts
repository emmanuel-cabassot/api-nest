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
        return await this.projectService.personnStatsByAge(minAge, maxAge);
    }

    @Get('age/:age')
    async searchPersonnByAge(@Param('age', ParseIntPipe) age): Promise<ProjectEntity[]> {
        return await this.projectService.personnByAge(age);
    }

    @Get()
    findAllPersonn(): Promise<ProjectEntity[]> {
        return this.projectService.findAllPersonn();
    }

    @Get(':id')
    findOnePersonn(@Param() params) {
        return this.projectService.findOnePersonn(params.id);
    }

    @Post()
    addPersonn(
        @Body() addPersonnDto: AddProjectDto): Promise<ProjectEntity> {
        return this.projectService.addPersonn(addPersonnDto);
    }

    @Delete(':id')
    removePersonn(@Param('id', ParseIntPipe) id) {
        return this.projectService.removePersonn(id);
    }

    @Delete('deleteSoft/:id')
    deleteSoftPersonn(@Param('id', ParseIntPipe) id) {
        return this.projectService.deleteSoftPersonn(id);
    }

    @Get('restore/:id')
    restorePersonn(@Param('id', ParseIntPipe) id) {
        return this.projectService.restorePersonn(id);
    }

    // http://localhost:3000/personn/name/nameOfPersonn
    @Delete('name/:name')
    deleteByName(@Param('name') name) {
        return this.projectService.deleteByName(name);
    }

    @Patch(':id')
    async updatePersonn(
        @Body() updatePersonnDto: UpdateProjectDto,
        @Param('id', ParseIntPipe) id): Promise<ProjectEntity> {
        return await this.projectService.updatePersonn(id, updatePersonnDto);
    }


}
