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
    
    @Post()
    userRegister(@Body() userRegisterDto: userRegisterDto): Promise<Partial<UserEntity>> {
            return this.userService.userRegister(userRegisterDto);
    }
}

