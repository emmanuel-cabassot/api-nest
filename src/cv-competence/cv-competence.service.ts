import { CompetenceEntity } from './../competence/entities/competence.entity/competence.entity';
import { CvEntity } from './../cv/entities/cv.entitiy/cv.entity';
import { CvCompetenceEntity } from './entities/cv-competence.entity/cv-competence.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CvCompetenceService {
    constructor(
        @InjectRepository(CvCompetenceEntity)
        private readonly cvCompetenceRepository: Repository<CvCompetenceEntity>,
        @InjectRepository(CvEntity)
        private readonly cvRepository: Repository<CvEntity>,
        @InjectRepository(CompetenceEntity)
        private readonly CompetenceRepository: Repository<CompetenceEntity>,
    ) { }

    async findAll() {
        return await this.cvCompetenceRepository.find();
    }

    async addCvCompetence(cvCompetence, user) {
        const { id_cv  } = cvCompetence;
        const cv = await this.cvRepository.findOne({ where: { id: id_cv }});
        
        if (!cv) throw new HttpException('Cv not found', 404);

        if (cv.user.id !== user.id && user.role !== 'admin') throw new HttpException('You are not the author of this cv', 403);

        const competence = await this.CompetenceRepository.findOne({ where: { id: cvCompetence.id_competence }});

        if (!competence) throw new HttpException('competence not found', 404);

        const newCvCompetence = new CvCompetenceEntity();
        newCvCompetence.idCv = id_cv;
        newCvCompetence.idCompetence = cvCompetence.id_competence;

        return await this.cvCompetenceRepository.save(newCvCompetence);
        // cvCompetence.cv = cv;
        // cvCompetence.competence = competence;

        // return await this.cvCompetenceRepository.save(cvCompetence);
    }

}
