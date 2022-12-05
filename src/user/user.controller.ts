import { JwtAuthGuard } from './guards/jwt-auth.gard';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';
import { userRegisterDto } from './dto/user-register.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAllUser(): Promise<UserEntity[]> {
        return this.userService.findAllUser();
    }
    
    @Post('register')
    userRegister(@Body() userRegisterDto: userRegisterDto): Promise<Partial<UserEntity>> {
            return this.userService.userRegister(userRegisterDto);
    }

    @Get('login')
    loginCredentialsDto(@Body() loginCredentialsDto: LoginCredentialsDto) {
        return this.userService.login(loginCredentialsDto);
    }
}

