import { projectCompetenceEntity } from './entities/project-competence.entity/project-competence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './../project/entities/project.entity/project.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { Repository, In } from 'typeorm';

@Injectable()
export class ProjectCompetenceService {

    constructor(
        @InjectRepository(projectCompetenceEntity)
        private projectCompetenceRepository: Repository<projectCompetenceEntity>,
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
    ) { }

    async findProjectsByCompetence(id: number) {
        const competence = await this.projectCompetenceRepository.find({ where: { idCompetence: id } });
        // Si la compétence n'existe pas, on renvoie une erreur
        if (!competence)
            throw new HttpException("Cette compétence n'existe dans aucun projet", 404);

        const idsProject = competence.map(project => {
            return project.idProject
        });

        const projects = await this.projectRepository.find({ where: { id: In(idsProject) } });
        const projectsWithSofttUser = projects.map(project => {

            this.deleteSensitiveDataUser(project);

            return project;
        });
        return projectsWithSofttUser;
    }

    async deleteSensitiveDataUser(project: ProjectEntity) {
        delete project.user.password;
        delete project.user.refresh_token;
        delete project.user.email;
        delete project.user.createdAt;
        delete project.user.updatedAt;
        return project;
    }
}
