import { CompetenceEntity } from './entities/competence.entity/competence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CompetenceController } from './competence.controller';
import { CompetenceService } from './competence.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompetenceEntity])],
  controllers: [CompetenceController],
  providers: [CompetenceService]
})
export class CompetenceModule {}
