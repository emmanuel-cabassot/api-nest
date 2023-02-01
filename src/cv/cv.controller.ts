import { AccessTokenGuard } from './../user/guards/access-token.guard';
import { CvService } from './cv.service';
import { Controller, Get, Post, UseGuards, Body, Req, Delete, Param, Patch } from '@nestjs/common';

@Controller('cv')
export class CvController {
    constructor(private cvService: CvService) { }

    @Get('user')
    @UseGuards(AccessTokenGuard)
    async findAllCvByUser(
        @Req() request: any
    ) {
        // recupere le user de la requete
        const { user } = request;
        console.log('##############user : ', user)
        return await this.cvService.findAllCvByUser(user);
    }

    @Get()
    async findAll() {
        return await this.cvService.findAll();
    }

    @UseGuards(AccessTokenGuard)
    @Post()
    async addCv(
        @Body() cv: any,
        @Req() request: any
    ) {
        // console.log('request user : ', request.user)
        return await this.cvService.addCv(cv, request.user);
    }


    @UseGuards(AccessTokenGuard)
    @Patch('update/:id')
    async updateCv(
        @Param('id') id: number,
        @Body() cv: any,
        @Req() request: any
    ) {
        // recupere le user de la requete
        const { user } = request;
        console.log('id : ', id)
        // console.log('request user : ', request.user)
        return await this.cvService.updateCv(id, cv, user);
    }

    @UseGuards(AccessTokenGuard)
    @Delete('delete/:id')
    async deleteCv(
        @Param('id') id: number,
        @Req() request: any
    ) {
        // recupere le user de la requete
        const { user } = request;
        console.log('id : ', id)
        // console.log('request user : ', request.user)
        return await this.cvService.deleteCv(id, user);
    }

}
