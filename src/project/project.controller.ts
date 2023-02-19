import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from './../user/guards/access-token.guard';
import { UserEntity } from './../user/entites/user.entity/user.entity';
import { ProjectService } from './project.service';
import { Controller, Get, Post, Patch, Param, Body, ParseIntPipe, Delete, UseGuards, Req, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProjectEntity } from './entities/project.entity/project.entity';
import { AddProjectDto } from './dto/add-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';
import { ApiTags, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { join } from 'path';
import { map, Observable, of, tap } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const storage = {
    storage: diskStorage({
        destination: './uploads/project-images',
        filename: (req, file, cb) => {
            const filename = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        },
    }),
};

@Controller('project')
@ApiTags('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    // upload project image with id project
    @UseGuards(AccessTokenGuard)
    @Post('upload-project-image/:id')
    @UseInterceptors(FileInterceptor('file', storage))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10000000 }),
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
                ],
            }),
        )
        file,
        @Req() req,
        @Param('id', ParseIntPipe) idProject,
    ) {
        const idUser = req.user.id;

        return await this.projectService.updateOne(idUser, idProject, { projectImage: file.filename });
    }

    // get my projects
    @Get('myProjects')
    @UseGuards(AccessTokenGuard)
    async findMyProjects(
        @User() user: UserEntity
    ): Promise<ProjectEntity[]> {
        console.log('on rentre dans findMyProjects')

        return await this.projectService.findMyProjects(user);
    }

    @Get('stats/:minAge/:maxAge')
    async getStatsByAge(@Param('minAge', ParseIntPipe) minAge, @Param('maxAge', ParseIntPipe) maxAge): Promise<ProjectEntity[]> {
        return await this.projectService.projectStatsByAge(minAge, maxAge);
    }

    @Get('age/:age')
    async searchProjectByAge(@Param('age', ParseIntPipe) age): Promise<ProjectEntity[]> {
        return await this.projectService.projectByAge(age);
    }

    // find project by id
    @Get(':id')
    @ApiParam({ name: 'id', type: 'number', description: 'id of the project', required: true })
    @ApiResponse({
        status: 200,
        description: 'A post has been successfully fetched',
        type: ProjectEntity
    })
    @ApiResponse({
        status: 404,
        description: 'A post with given id does not exist.'
    })
    findOneProject(@Param() params): Promise<ProjectEntity> {
        return this.projectService.findOneProject(params.id);
    }

    // restore project by id
    @Get('restore/:id')
    @ApiParam({ name: 'id', type: 'number', description: 'id of the project to restore', required: true })
    @UseGuards(AccessTokenGuard)
    restoreProject(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request
    ) {
        const user = request.user;
        return this.projectService.restoreProject(id, user);
    }

    @Get()
    async findAllProjects(): Promise<ProjectEntity[]> {
        return await this.projectService.findAllProjects();
    }

    // Post new project
    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Add a project with infos user: require TOKEN' })
    @ApiBearerAuth()
    addProject(
        @Body() addProjectDto: AddProjectDto,
        // @Req() va récupérer les infos qui sont renvoyées par la méthode validate de la classe JwtStrategy(jwt-strategy.ts)
        @Req() request: Request
    ) {
        const user = request.user;
        return this.projectService.addProject(addProjectDto, user);
    }

    // delete project by id
    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Delete a project with infos user: require TOKEN' })
    @ApiParam({ name: 'id', type: 'number', description: 'id of the project to delete', required: true })
    @ApiBearerAuth()
    removeProject(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request
    ) {
        const user = request.user;
        return this.projectService.removeProject(id, user);
    }

    // soft delete project
    @Delete('deleteSoft/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a project if you are the owner: require or admin: require' })
    @ApiParam({ name: 'id', type: 'number', description: 'id of the project to soft delete', required: true })
    async deleteSoftProject(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request
    ) {
        const user = request.user;

        return this.projectService.deleteSoftProject(id, user);
    }

    // delete project by name
    @Delete('name/:name')
    @UseGuards(AccessTokenGuard)
    @ApiParam({ name: 'name', type: 'string', description: 'name of the project to delete', required: true })
    deleteByName(
        @Param('name') name: string,
        @Req() request: Request
    ) {
        const user = request.user;
        return this.projectService.deleteByName(name, user);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: 'number', description: 'id of the project to update', required: true })
    @UseGuards(AccessTokenGuard)
    async updateProject(
        @Body() updateProjectDto: UpdateProjectDto,
        @Param('id', ParseIntPipe) id): Promise<ProjectEntity> {
        return await this.projectService.updateProject(id, updateProjectDto);
    }

    // recuperer l'image du projet
    @Get('project-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {

        return of(res.sendFile(join(process.cwd(), 'uploads/project-images/' + imagename)));
    }
}
