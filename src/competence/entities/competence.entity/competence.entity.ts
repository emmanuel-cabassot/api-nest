import { projectCompetenceEntity } from './../../../project-competence/entities/project-competence.entity/project-competence.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity('competence')
export class CompetenceEntity {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'varchar',
        length: 30,
    })
    name: string;

    @OneToMany(
        type => projectCompetenceEntity,
        projectCompetence => projectCompetence.competence
    )
    projects: projectCompetenceEntity[];
}