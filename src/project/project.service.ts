import { UserRoleEnum } from './../enum/user-role.enum';
import { UserEntity } from './../user/entites/user.entity/user.entity';
import { Injectable, HttpException, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity/project.entity';
import { Repository } from 'typeorm';
import { AddProjectDto } from './dto/add-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';


@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private projectRepository: Repository<ProjectEntity>
    ) { }

    projectExist(id: number) {
        const cv = this.findOneProject(id);
        if (!cv) {
            new HttpException('Project not found', 404);
        }

        return cv;
    }

    async findAllProject(user: UserEntity): Promise<ProjectEntity[]> {
        const { id } = user;
        // Si l'utilisateur est un admin, on lui renvoie tous les projets
        if (user.role === UserRoleEnum.ADMIN) {
            const projects = await this.projectRepository.find();
            // On enleve les informations sensibles
            const projectsWithoutUser = projects.map( project => {
                if (project.user === null) {
                    return project;
                }
                delete project.user.password;
                delete project.user.salt;
                return project;
            });
            return projectsWithoutUser;
        }
        const projects = await this.projectRepository.find({
            where: {user: { id } }
         });
         const projectsWithoutUser = projects.map( project => {
                delete project.user.password;
                delete project.user.salt;
                return project; 
            });

         return projectsWithoutUser;
    }

    findOneProject(id: number): Promise<ProjectEntity> {
        return this.projectRepository.findOneBy({ id });
    }

    addProject(project: AddProjectDto, user: any): Promise<ProjectEntity> {
        // va créer un objet de type ProjectEntity et va lui ajouter les propriétés de l'objet project
        //( si dans la requete on met d'autres informations que celles de l'objet project, elles seront ignorées)
        const newProject = this.projectRepository.create(project);
        // on ajoute l'utilisateur qui a créé le projet
        newProject.user = user;
        // on sauvegarde le projet
        return this.projectRepository.save(newProject);
    }

    async removeProject(id: number) {
        const projectToRemove = await this.projectExist(id);

        return this.projectRepository.remove(projectToRemove);
    }

    async deleteSoftProject(id: number) {

        return this.projectRepository.softDelete(id);
    }

    async restoreProject(id: number) {
        return this.projectRepository.restore(id);
    }

    deleteByName(name: string) {

        return this.projectRepository.delete({ name });
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

    async projectStatsByAge( minAge: number, maxAge: number ): Promise<any> {
        // Creér un query builder
        const qb = this.projectRepository.createQueryBuilder('project');
        return await qb.select("project.age, count(project.id) as nombreDeProjets")
            .where('project.age >= :minAge and project.age <= :maxAge')
            .setParameters( { minAge, maxAge } )
            .groupBy("project.age")
            .getRawMany();
    }
}


