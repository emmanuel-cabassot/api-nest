import { ProjectEntity } from 'src/project/entities/project.entity/project.entity';
import { from, Observable, switchMap } from 'rxjs';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    findAllUser(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async userRegister(userData: UserRegisterDto) {
        const password = await argon2.hash(userData.password);

        const user = await this.userRepository.create({
            ...userData, password
        });

        try {
            await this.userRepository.save(user);
        } catch (e) {
            throw new ConflictException('Email or surname already exists');
        }

        const tokens = await this.getTokens(user.id, user.surname, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            access_token: tokens.refreshToken,
            refresh_token: tokens.accessToken,
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
        const verifyHashedPassword = await argon2.verify(user.password, password);
        if (verifyHashedPassword) {
            // on génère un token et refresh token
            const tokens = await this.getTokens(user.id, user.surname, user.email, user.role);
            // on met à jour le refresh token dans la base de données
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return {
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
            };

            // si le mot de passe ne correspond pas on renvoie une erreur
        } else {
            throw new NotFoundException('user or password incorrect');
        }
    }

    async logout(userId: number) {
        this.update(userId, { refresh_token: null });
        return { refresh_token: null };
    }


    async refreshTokens(userId: number, refreshToken: string) {
        console.log('1');
        
        const user = await this.userRepository.findOneBy({ id: userId });
        console.log('user', user);
        
        if (!user || !user.refresh_token)
        console.log('2');
        
            throw new NotFoundException('Refresh token invalid');
            console.log('3');
            
        const refreshTokenMatches = await argon2.verify(user.refresh_token, refreshToken);
        console.log('refreshTokenMatches', refreshTokenMatches);
        

        if (!refreshTokenMatches) {
            console.log('4');
            
            throw new NotFoundException('Refresh token invalidddd');
        }
        const tokens = await this.getTokens(user.id, user.surname, user.email, user.role);
        console.log('tokens', tokens)
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.update(userId, {
            refresh_token: hashedRefreshToken,
        });
    }

    updateOne(id: number, user: Partial<UserEntity>): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;

        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.userRepository.findOneBy({ id }))
        );
    }

    async getMyLikedProjects(userId: number): Promise<ProjectEntity[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['likedProjects'],
        });
        return user?.likedProjects;
    }

    async userInfos(userId: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['likedProjects', 'favoriteProjects'],
        });
        return user;
    }

    async getMyFavoriteProjects(userId: number): Promise<ProjectEntity[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favoriteProjects'],
        });
        return user?.favoriteProjects;
    }

    async addLikedProject(user: Partial<UserEntity>, projectId: number) {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        const likedProjects = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['likedProjects'],
        });

        await this.userRepository.save({
            ...user,
            likedProjects: [...likedProjects.likedProjects, project],
        });
        return project;
    }
    

    async addFavoriteProject(user: Partial<UserEntity>, projectId: number) {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        const favoriteProjects = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['favoriteProjects'],
        });

        await this.userRepository.save({
            ...user,
            favoriteProjects: [...favoriteProjects.favoriteProjects, project],
        });
        return project;
    }

    async deleteLikedProject(user: Partial<UserEntity>, projectId: number) {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        const likedProjects = await this.userRepository.findOne({
            where: { id: user.id },

            relations: ['likedProjects'],
        });
        await this.userRepository.save({
            ...user,
            likedProjects: likedProjects.likedProjects.filter(

                (likedProject) => likedProject.id !== project.id
            ),
        });
        return project;
    }

    async deleteFavoriteProject(user: Partial<UserEntity>, projectId: number) {
        const project = await this.projectRepository.findOneBy({ id: projectId });
        const favoriteProjects = await this.userRepository.findOne({
            where: { id: user.id },

            relations: ['favoriteProjects'],
        });
        await this.userRepository.save({
            ...user,
            likedProjects: favoriteProjects.favoriteProjects.filter(

                (favoriteProject) => favoriteProject.id !== project.id
            ),
        });
        return project;
    }

    async getTokens(userId: number, surname: string, email: string, role: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: userId,
                    surname,
                    email,
                    role
                },
                {
                    secret: process.env.SECRET_KEY_JWT,
                    expiresIn: 60 * 60 * 24 * 30,
                },
            ),
            this.jwtService.signAsync(
                {
                    id: userId,
                    surname,
                    email,
                    role
                },
                {
                    secret: process.env.SECRET_REFRESH_KEY_JWT,
                    expiresIn: 60 * 60 * 24 * 30,
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async update(
        id: number,
        refreshToken
            : Partial<UserEntity>,
    ) {
        return this.userRepository
            .createQueryBuilder()
            .update(UserEntity)
            .set(refreshToken)
            .where('id = :id', { id })
            .execute();
    }

}


