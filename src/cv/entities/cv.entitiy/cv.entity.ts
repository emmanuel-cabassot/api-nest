import { projectCompetenceEntity } from './../../../project-competence/entities/project-competence.entity/project-competence.entity';
import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
@Entity('cv')
export class CvEntity {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'varchar',
        length: 50,
    })
    name: string;

    @Column({
        name: 'about_me',
        type: 'text',
    })
    aboutMe: string;

}