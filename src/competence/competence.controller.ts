import { CompetenceEntity } from './entities/competence.entity/competence.entity';
import { CompetenceService } from './competence.service';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { get } from 'http';

@Controller('competence')
export class CompetenceController {
    constructor(private competenceService: CompetenceService){}
    
    @Get()
    async findAllCompetences(): Promise<CompetenceEntity[]> {
        return await this.competenceService.findAllCompetences();
    }

    @Get(':id')
    async findOneCompetence(@Param() params): Promise<CompetenceEntity> {
        return await this.competenceService.findOneCompetence(params.id);
    }

    @Post(':name')
    async createCompetence(@Param() params): Promise<CompetenceEntity> {
        return await this.competenceService.createCompetence(params.name);
    }

}
