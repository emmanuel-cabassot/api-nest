import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('competence')
export class CompetenceEntity {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'varchar',
        length: 30,
    })
    name: string;

    projects: ProjectEntity[];
}