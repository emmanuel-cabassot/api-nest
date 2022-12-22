import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { CompetenceModule } from './competence/competence.module';
import { ProjectUserModule } from './project-user/project-user.module';
import { ProjectCompetenceModule } from './project-competence/project-competence.module';
import { CvModule } from './cv/cv.module';
import { CvCompetenceModule } from './cv-competence/cv-competence.module';
import { CvAspirationsModule } from './cv-aspirations/cv-aspirations.module';
import { AspirationsModule } from './aspirations/aspirations.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: '',
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }), ProjectModule, UserModule, CompetenceModule, ProjectUserModule, ProjectCompetenceModule, CvModule, CvCompetenceModule, CvAspirationsModule, AspirationsModule, LikeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
