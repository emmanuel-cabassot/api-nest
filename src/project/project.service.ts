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

    personnExist(id: number) {
        const cv = this.findOnePersonn(id);
        if (!cv) {
            new HttpException('Personne not found', 404);
        }

        return cv;
    }

    findAllPersonn(): Promise<ProjectEntity[]> {
        return this.projectRepository.find();
    }

    findOnePersonn(id: number): Promise<ProjectEntity> {
        return this.projectRepository.findOneBy({ id });
    }

    addPersonn(addPersonnDto: AddProjectDto): Promise<ProjectEntity> {
        return this.projectRepository.save(addPersonnDto);
    }

    async removePersonn(id: number) {
        const personnToRemove = await this.personnExist(id);

        return this.projectRepository.remove(personnToRemove);
    }

    async deleteSoftPersonn(id: number) {

        return this.projectRepository.softDelete(id);
    }

    async restorePersonn(id: number) {
        return this.projectRepository.restore(id);
    }

    deleteByName(name: string) {

        return this.projectRepository.delete({ name });
    }

    async updatePersonn(id: number, updatePersonnDto: UpdateProjectDto): Promise<ProjectEntity> {
        const newPersonn = await this.projectRepository.preload({
            id,
            ...updatePersonnDto
        });
        return await this.projectRepository.save(newPersonn);
    }

    // recupère les personnes par age
    async personnByAge(age: number): Promise<ProjectEntity[]> {
        // Creér un query builder
        const qb = this.projectRepository.createQueryBuilder('personn');
        return qb.where('personn.age = :age')
        .setParameter('age', age)
        .getMany();
    }

    async personnStatsByAge( minAge: number, maxAge: number ): Promise<any> {
        // Creér un query builder
        const qb = this.projectRepository.createQueryBuilder('personn');
        return await qb.select("personn.age, count(personn.id) as nombreDePersonnes")
            .where('personn.age >= :minAge and personn.age <= :maxAge')
            .setParameters( { minAge, maxAge } )
            .groupBy("personn.age")
            .getRawMany();
    }
}


