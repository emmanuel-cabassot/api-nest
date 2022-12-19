import { AccessTokenGuard } from './../user/guards/access-token.guard';
import { CvCompetenceService } from './cv-competence.service';
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';

@Controller('cv-competence')
export class CvCompetenceController {
    constructor(private cvCompetenceService: CvCompetenceService) {}

    @Get()
    async findAll() {
        return await this.cvCompetenceService.findAll();
    }

    @UseGuards(AccessTokenGuard)
    @Post()
    async addCvCompetence(
        @Body() cvCompetence: any,
        @Req() request: any
    ) {
        console.log('request user : ', request.user)
        console.log('cvCompetence : ', cvCompetence);
        
        return await this.cvCompetenceService.addCvCompetence(cvCompetence, request.user);

    }

}
