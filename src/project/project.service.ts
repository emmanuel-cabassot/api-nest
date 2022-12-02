import { Injectable, HttpException } from '@nestjs/common';
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

    findAllProject(): Promise<ProjectEntity[]> {
        return this.projectRepository.find();
    }

    findOneProject(id: number): Promise<ProjectEntity> {
        return this.projectRepository.findOneBy({ id });
    }

    addProject(addProjectDto: AddProjectDto): Promise<ProjectEntity> {
        return this.projectRepository.save(addProjectDto);
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


