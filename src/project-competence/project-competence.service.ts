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

    async findAll() {
        const allProjectsCompetence = await this.projectCompetenceRepository.find();
        return allProjectsCompetence;
    }

    async deleteSensitiveDataUser(project: ProjectEntity) {
        delete project.user.password;
        delete project.user.refresh_token;
        delete project.user.email;
        delete project.user.createdAt;
        delete project.user.updatedAt;
        return project;
    }

    async addProjectCompetence(addProjectCompetence: any, user) {
        const project = await this.projectRepository.findOne({ where: { id: addProjectCompetence.id_project } });
        
        // Si le projet n'existe pas, on renvoie une erreur
        if (!project)
            throw new HttpException("Ce projet n'existe pas", 404);

        // Si l'utilisateur n'est pas le créateur du projet ou l'admin, on renvoie une erreur
        if (project.user.id != user.id && user.role != 'admin')
            throw new HttpException("Vous n'êtes pas le créateur de ce projet", 403);

        // On vérifie que la compétence n'est pas déjà associée au projet
        const projectCompetence = await this.projectCompetenceRepository.findOne({ where: { idProject: addProjectCompetence.id_project, idCompetence: addProjectCompetence.id_competence } });
        if (projectCompetence)
            throw new HttpException("Cette compétence est déjà associée à ce projet", 409);

        // On crée l'entité
        const newProjectCompetenceEntity = new projectCompetenceEntity();
        
        newProjectCompetenceEntity.idProject = addProjectCompetence.id_project;
        newProjectCompetenceEntity.idCompetence = addProjectCompetence.id_competence;

        return await this.projectCompetenceRepository.save(newProjectCompetenceEntity);
     
    }
}
