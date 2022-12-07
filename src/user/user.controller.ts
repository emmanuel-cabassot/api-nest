import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';
import { userRegisterDto } from './dto/user-register.dto';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(AccessTokenGuard)
    findAllUser(): Promise<UserEntity[]> {
        return this.userService.findAllUser();
    }

    @Post('register')
    userRegister(@Body() userRegisterDto: userRegisterDto) {
        return this.userService.userRegister(userRegisterDto);
    }

    @Get('login')
    loginCredentialsDto(@Body() loginCredentialsDto: LoginCredentialsDto) {
        return this.userService.login(loginCredentialsDto);
    }


    @UseGuards(AccessTokenGuard)
    @Get('refresh')
    refreshTokens(@Body() refreshTokenObject, @User() user: Request) {
        console.log('refreshToken : ', refreshTokenObject.refresh_token);
        const refreshToken = refreshTokenObject.refresh_token;
        const userId = user['id'];
        // console.log(request)
        // console.log('refreshToken (user controller) : ', refreshToken);
        return this.userService.refreshTokens(userId, refreshToken);
    }

    // refresh token bdd : $2b$10$PDjTajcxIg/KDO0y5hZ8Wu5MW7UeK//9pHnasaXY.YKzCrsWdN2Le
    // refresh token :  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInN1cm5hbWUiOiJlbW1hbnVlbEBnbWFpbC5jb20iLCJlbWFpbCI6ImVtbWFudWVsQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjcwMzU0NTQ1LCJleHAiOjE2NzA5NTkzNDV9.837-H1L7-pUMVP1NzcQdLOe3Qc1AgRbZLKuEHLx1HCI
    @Get('logout')
    @UseGuards(RefreshTokenGuard)
    logout(@Req() request: Request) {
        const userId = request.user['id']
        return this.userService.logout(userId);
    }
}
