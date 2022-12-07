import { AccessTokenStrategy } from './strategy/acessToken.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from "./entites/user.entity/user.entity";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      // récupère les constantes du fichier .env grâce à la librairie dotenv(porcess.env.SECRET_KEY_JWT)
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 3600
      },
    })
],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class UserModule {}
