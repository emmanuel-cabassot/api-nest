import { CvEntity } from './../../../cv/entities/cv.entitiy/cv.entity';
import { CvCompetenceEntity } from './../../../cv-competence/entities/cv-competence.entity/cv-competence.entity';
import { projectCompetenceEntity } from './../../../project-competence/entities/project-competence.entity/project-competence.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
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

    @ManyToMany(
        () => CvEntity,
        cv => cv.competences,
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
      )
    cvs: CompetenceEntity[];



}