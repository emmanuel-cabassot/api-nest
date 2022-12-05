import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity/user.entity';
import { Repository } from 'typeorm';
import { userRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

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

    async login(credentials: LoginCredentialsDto) {
        const { username, password } = credentials;
        // recherche de l'utilisateur par son username ou son email
        const user = await this.userRepository.createQueryBuilder('user')
            .where('user.email = :email or user.surname = :surname')
            .setParameters({ email: username, surname: username })
            .getOne();

        // si l'utilisateur n'existe pas on renvoie une erreur
        if (!user) {
            throw new NotFoundException('user or password incorrect');
            // si l'utilisateur existe on vérifie son mot de passe
        }
        // on compare le mot de passe envoyé avec le mot de passe hashé
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword === user.password) {
            const payload = {
                id: user.id,
                surname: user.surname,
                email: user.email,
                role: user.role
            };
            const token = this.jwtService.sign(payload);
            return {
                "access_token": token
            };
          
        // si le mot de passe ne correspond pas on renvoie une erreur
        } else {
            throw new NotFoundException('user or password incorrect');
        }
    }
}


