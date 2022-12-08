import { PayloadInterface } from './../../interfaces/payload-interface';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './../entites/user.entity/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_REFRESH_KEY_JWT,
      expired: true,
      passReqToCallback: true,
      
      
    });
  }

  validate(req: Request, payload: any) {
    console.log('on rentre dans le validate de refreshTokenStrategy')
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
