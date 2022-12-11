import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompetenceEntity } from './entities/competence.entity/competence.entity';

@Injectable()
export class CompetenceService {
    constructor(
        @InjectRepository(CompetenceEntity)
        private competenceRepository: Repository<CompetenceEntity>
    ) { }

    async findAllCompetences(): Promise<CompetenceEntity[]> {

        return await this.competenceRepository.find();
    }

    async findOneCompetence(id: number): Promise<CompetenceEntity> {
        return await this.competenceRepository.findOneBy({ id });
    }

    async createCompetence(name: string) : Promise<CompetenceEntity>{
        const nameCompetenceExist = await this.competenceRepository.findOneBy({ name });
        if (nameCompetenceExist)
            throw new HttpException('Cette compétence existe déjà', HttpStatus.BAD_REQUEST);

        const newCompetence = this.competenceRepository.create({ name });
        return await this.competenceRepository.save(newCompetence);
    }

}
