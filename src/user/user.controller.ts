import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';
import { userRegisterDto } from './dto/user-register.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    findAllUser(): Promise<UserEntity[]> {
        return this.userService.findAllUser();
    }
    
    @Post('register')
    userRegister(@Body() userRegisterDto: userRegisterDto): Promise<Partial<UserEntity>> {
            return this.userService.userRegister(userRegisterDto);
    }

    @Get('login')
    loginCredentialsDto(@Body() loginCredentialsDto: LoginCredentialsDto): Promise<Partial<UserEntity>> {
        return this.userService.login(loginCredentialsDto);
    }
}

