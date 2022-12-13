import { AccessTokenGuard } from './guards/access-token.guard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Controller, Get, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, ParseIntPipe, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { Request } from 'express';
import { ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipe } from '@nestjs/common/pipes';
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
            console.log(req.user);
            
            console.log('path manuel@@@@@@@', file.originalname)
            console.log('path : ', path.parse(file.originalname));
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


    @Get('refresh')
    refreshTokens(@Body() refreshTokenObject) {
        console.log('refreshToken : ', refreshTokenObject.refresh_token);
        const refreshToken = refreshTokenObject.refresh_token;
        const userId = refreshTokenObject.id
        // console.log(request)
        // console.log('refreshToken (user controller) : ', refreshToken);
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
        uploadFile(@UploadedFile() file, @Req() req): Observable<Object> {
            const user: UserEntity = req.user;
    
            return this.userService.updateOne(user.id, {profileImage: file.filename}).pipe(
                tap((user: UserEntity) => console.log(user)),
                map((user:UserEntity) => ({profileImage: user.profileImage}))
            )
        }

        
    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
    }

}
