import { ProjectCompetenceService } from './project-competence.service';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('project-competence')
export class ProjectCompetenceController {

    constructor(private projectCompetenceService: ProjectCompetenceService) { }

    @Get('projectsByCompetence/:id')
    async findProjectsByCompetence(@Param('id', ParseIntPipe) id: number) {
        return await this.projectCompetenceService.findProjectsByCompetence(id);
    }
}
