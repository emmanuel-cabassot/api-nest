import { ProjectEntity } from 'src/project/entities/project.entity/project.entity';
import { AccessTokenGuard } from './guards/access-token.guard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Controller, Get, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, ParseIntPipe, Param, Res, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { Request } from 'express';
import { ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common/pipes';
import * as path from 'path';
import { join } from 'path';
import { map, Observable, of, tap } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            console.log('on passe')
            // console.log(req.user);

            // console.log('path manuel@@@@@@@', file.originalname)
            // console.log('path : ', path.parse(file.originalname));
            if (req.user['profileImage']) {
                const oldPath = join(__dirname, '..', '..', 'uploads', 'profileimages', req.user['profileImage']);
                console.log('oldPath : ', oldPath);
                fs.unlink(oldPath, (
                    err => {
                        if (err) {
                            console.log('err : ', err);
                        }
                    }
                ))
            }

            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(AccessTokenGuard)
    findAllUser(): Promise<UserEntity[]> {
        
        return this.userService.findAllUser();
    }

    

    @UseGuards(AccessTokenGuard)
    @Get('liked-projects')
    async getMyLikedProjects(@Req() request: Request): Promise<ProjectEntity[]> {
        const user = request.user['id'];

        return this.userService.getMyLikedProjects(user);
    }

    @UseGuards(AccessTokenGuard)
    @Get('me')
    async userInfos(@Req() request: Request): Promise<UserEntity> {
        const user = request.user['id'];

        return this.userService.userInfos(user);
    }

    @UseGuards(AccessTokenGuard)
    @Post('add-liked-project/:id')
    async addLikedProject(@Req() request: Request, @Param('id', ParseIntPipe) projectId): Promise<ProjectEntity> {
        const user = request.user;

        return this.userService.addLikedProject(user, projectId);
    }

    @UseGuards(AccessTokenGuard)
    @Delete('delete-liked-project/:id')
    async deleteLikedProject(@Req() request: Request, @Param('id', ParseIntPipe) projectId: number): Promise<ProjectEntity> {
        const user = request.user;

        return this.userService.deleteLikedProject(user, projectId);
    }

    @UseGuards(AccessTokenGuard)
    @Get('favorites-projects')
    async getMyFavoriteProjects(@Req() request: Request): Promise<ProjectEntity[]> {
        const user = request.user['id'];

        return this.userService.getMyFavoriteProjects(user);
    }

    @UseGuards(AccessTokenGuard)
    @Post('add-favorite-project/:id')
    async addFavoriteProject(@Req() request: Request, @Param('id', ParseIntPipe) projectId): Promise<ProjectEntity> {
        const user = request.user;

        return this.userService.addFavoriteProject(user, projectId);
    }

    @UseGuards(AccessTokenGuard)
    @Delete('delete-favorite-project/:id')
    async deleteFavoriteProject(@Req() request: Request, @Param('id', ParseIntPipe) projectId: number): Promise<ProjectEntity> {
        const user = request.user;

        return this.userService.deleteFavoriteProject(user, projectId);
    }

    @Post('register')
    @ApiBody({ type: [UserRegisterDto] })
    userRegister(@Body() userRegisterDto: UserRegisterDto) {

        return this.userService.userRegister(userRegisterDto);
    }

    @Post('login')
    @ApiBody({ type: [LoginCredentialsDto] })
    loginCredentialsDto(@Body() loginCredentialsDto: LoginCredentialsDto) {

        return this.userService.login(loginCredentialsDto);
    }


    @Get('refresh/:refreshToken/:id')
    refreshTokens(@Param('refreshToken') refreshToken: string, @Param('id', ParseIntPipe) userId: number) {
        console.log('refreshToken', refreshToken);
        console.log('userId', userId);

        return this.userService.refreshTokens(userId, refreshToken);
    }

    @Get('logout')
    @UseGuards(AccessTokenGuard)
    logout(@Req() request: Request) {
        const userId = request.user['id']

        return this.userService.logout(userId);
    }

    @UseGuards(AccessTokenGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1000000000 }),
                new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
            ],
        })
    ) file, @Req() req): Observable<Object> {
        const user: UserEntity = req.user;

        return this.userService.updateOne(user.id, { profileImage: file.filename }).pipe(
            tap((user: UserEntity) => console.log(user)),
            map((user: UserEntity) => ({ profileImage: user.profileImage }))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {

        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
    }

}
