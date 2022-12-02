import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entites/user.entity/user.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    findAllUser(): Promise<UserEntity[]> {
        return this.userService.findAllUser();

        
    }
}

