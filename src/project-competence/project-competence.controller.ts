import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ProjectCompetenceService } from './project-competence.service';
import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, Body } from '@nestjs/common';
import { projectCompetenceEntity } from './entities/project-competence.entity/project-competence.entity';

@Controller('project-competence')
export class ProjectCompetenceController {

    constructor(private projectCompetenceService: ProjectCompetenceService) { }

    @Get('projectsByCompetence/:id')
    async findProjectsByCompetence(@Param('id', ParseIntPipe) id: number) {
        return await this.projectCompetenceService.findProjectsByCompetence(id);
    }

    @Get()
    async findAll() {
        return await this.projectCompetenceService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addProjectCompetence(
        @Body() addProjectCompetence: projectCompetenceEntity,
        @Req() req: Request
        ) {

        return await this.projectCompetenceService.addProjectCompetence(addProjectCompetence, req['user']);
    }
}
