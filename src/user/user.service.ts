import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity/user.entity';
import { Repository } from 'typeorm';
import { userRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    findAllUser(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async userRegister(userData: userRegisterDto): Promise<Partial<UserEntity>> {
        const user = this.userRepository.create({
            ...userData
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try {
            await this.userRepository.save(user);
        } catch (e) {
            throw new ConflictException('Email or surname already exists');
        }
  
        return {
            id: user.id,
            surname: user.surname,
            email: user.email,
            role: user.role
          };
    }
}


