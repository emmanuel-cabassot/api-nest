import { join } from 'path';
import { from, Observable, switchMap } from 'rxjs';
import { CompetenceEntity } from './../competence/entities/competence.entity/competence.entity';
import { UserRoleEnum } from './../enum/user-role.enum';
import { UserEntity } from './../user/entites/user.entity/user.entity';
import { Injectable, HttpException, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity/project.entity';
import { In, Repository } from 'typeorm';
import { AddProjectDto } from './dto/add-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs';
import { unlink } from 'fs';

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>,
        @InjectRepository(CompetenceEntity)
        private competenceRepository: Repository<CompetenceEntity>
    ) { }

    async findAllProjects(): Promise<ProjectEntity[]> {
        const allProjects = await this.projectRepository.find();
        const projectsWithSofttUser = allProjects.map(project => {
            if (project.user === null)
                return project;

            this.deleteSensitiveDataUser(project);

            return project;
        });
        return projectsWithSofttUser;
    }

    async findMyProjects(user: UserEntity): Promise<ProjectEntity[]> {
        const { id } = user;
        // Si l'utilisateur est un admin, on lui renvoie tous les projets
        if (user.role === UserRoleEnum.ADMIN) {
            const projects = await this.projectRepository.find();
            // On enleve les informations sensibles
            const projectsWithoutUser = projects.map(project => {
                // Si le projet n'a pas d'utilisateur, on le renvoie tel quel
                if (project.user === null)
                    return project;
                // Sinon on enleve les informations sensibles
                this.deleteSensitiveDataUser(project);

                return project;
            });
            return projectsWithoutUser;
        }
        const projects = await this.projectRepository.find({
            where: { user: { id } }
        });
        //Si l'on ne trouve pas de projet, on renvoie une erreur
        if (!projects)
            throw new HttpException("Vous n'avez pas encore créé de projet", 404);

        // On enleve les informations sensibles
        const projectsWithoutUser = projects.map(project => {
            delete project.user.password;
            return project;
        });

        return projectsWithoutUser;
    }

    async findOneProject(id: number): Promise<ProjectEntity> {
        const project = await this.projectExist(id);
        // Si le projet n'a pas d'utilisateur, on le renvoie tel quel
        project ? this.deleteSensitiveDataUser(project) : null

        return project;
    }

    async addProject(project: AddProjectDto, user): Promise<ProjectEntity> {
        // va créer un objet de type ProjectEntity et va lui ajouter les propriétés de l'objet project
        //( si dans la requete on met d'autres informations que celles de l'objet project, elles seront ignorées)
        const newProject = this.projectRepository.create(project);
        // on ajoute l'utilisateur qui a créé le projet
        newProject.user = user;
        // on sauvegarde le projet en base de données
        const saveProject = await this.projectRepository.save(newProject);
        // on enleve les informations sensibles de l'utilisateur
        saveProject ? this.deleteSensitiveDataUser(saveProject) : null

        // on renvoie le projet
        return saveProject;
    }

    async updateOne(idUser: number, idProject: number, projectImage: Partial<ProjectEntity>) {
        const projectToUpdate = await this.projectRepository.findOne({ where: { id: idProject } });
        // Si le projet n'existe pas, on renvoie une erreur
        if (!projectToUpdate) {
          throw new HttpException("Le projet que vous voulez modifier n'existe pas", 404);
        }
      
        // On vérifie que l'utilisateur a bien accès au projet
        const userIds = projectToUpdate.projectUsers.map((projectUser) => projectUser.user.id);
        if (!userIds.includes(idUser)) {
          fs.unlink(
            join(__dirname, '..', '..', 'uploads', 'project-images', projectImage.projectImage),
            (err) => {
              if (err) throw err;
              console.log('successfully deleted /tmp/hello');
            },
          );
          throw new HttpException("Vous n'avez pas accès à ce projet", 403);
        }
      
        if (projectToUpdate.projectImage && projectToUpdate.projectImage !== 'switch3415c855-02fc-4371-9154-730beeb60595.png') {
          fs.unlink(
            join(__dirname, '..', '..', 'uploads', 'project-images', projectToUpdate.projectImage),
            (err) => {
              if (err) throw err;
              console.log('successfully deleted /tmp/hello');
            },
          );
        }
      
        return from(this.projectRepository.update(idProject, projectImage)).pipe(
          switchMap(() => this.projectRepository.findOneBy({ id: idProject })),
          );
        }

    async removeProject(id: number, user: object) {
        const projectToRemove = await this.projectExist(id);

        if (projectToRemove.user.id !== user['id'] && user['role'] !== UserRoleEnum.ADMIN)
            throw new HttpException("Vous ne pouvez pas supprimer un projet que vous n'avez pas créé", 403);

        return this.projectRepository.remove(projectToRemove);
    }

    async deleteSoftProject(id: number, user: object) {
        const projectToDelete = await this.projectExist(id);

        if (projectToDelete.user.id !== user['id'] && user['role'] !== UserRoleEnum.ADMIN)
            throw new HttpException("Vous ne pouvez pas supprimer un projet que vous n'avez pas créé", 403);

        return this.projectRepository.softDelete(id);
    }

    async restoreProject(id: number, user: object) {
        const projectToRestore = await this.projectExist(id);

        if (projectToRestore.user.id !== user['id'] && user['role'] !== UserRoleEnum.ADMIN)
            throw new HttpException("Vous ne pouvez pas restaurer un projet que vous n'avez pas créé", 403);

        return this.projectRepository.restore(id);
    }

    async deleteByName(name: string, user: object) {
        const id = user['id'];
        const projectToDelete = await this.projectRepository.findOne({ where: { name, user: { id } } });
        console.log('projectToDelete', projectToDelete);
        if (!projectToDelete)
            throw new HttpException('Project not found', 404);


        return this.projectRepository.delete(projectToDelete);
    }

    async updateProject(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {
        const newProject = await this.projectRepository.preload({
            id,
            ...updateProjectDto
        });

        return await this.projectRepository.save(newProject);
    }

    // recupère les projets par age
    async projectByAge(age: number): Promise<ProjectEntity[]> {
        // Creér un query builder
        const qb = this.projectRepository.createQueryBuilder('project');
        return qb.where('project.age = :age')
            .setParameter('age', age)
            .getMany();
    }

    async projectStatsByAge(minAge: number, maxAge: number): Promise<any> {
        // Creér un query builder
        const qb = this.projectRepository.createQueryBuilder('project');
        return await qb.select("project.age, count(project.id) as nombreDeProjets")
            .where('project.age >= :minAge and project.age <= :maxAge')
            .setParameters({ minAge, maxAge })
            .groupBy("project.age")
            .getRawMany();
    }

    async projectExist(id: number) {
        const project = await this.projectRepository.findOneBy({ id });
        if (!project) {
            throw new HttpException('Project not found', 404);
        }

        return project;
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


