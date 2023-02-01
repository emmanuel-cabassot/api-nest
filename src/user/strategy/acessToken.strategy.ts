import { UserEntity } from './../entites/user.entity/user.entity';
import { PayloadInterface } from './../../interfaces/payload-interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';


dotenv.config();
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // Injecte le repository de l'entité UserEntity qui sera utilisé dans la méthode validate
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    // gestion des requêtes entrantes
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // récupère le secret du fichier user.module.ts
      secretOrKey: process.env.SECRET_KEY_JWT,
    });
  }


  async validate(payload: PayloadInterface) {
    const user = await this.userRepository.findOneBy({ email: payload.email });
    if (user) {
      const { password,  ...result } = user;
      return result;
    } else {
      return new UnauthorizedException();
    }
  }
}
