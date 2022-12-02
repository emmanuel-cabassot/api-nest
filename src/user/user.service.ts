import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    findAllUser(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }   
}


