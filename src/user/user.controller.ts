import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';
import { ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

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
}
