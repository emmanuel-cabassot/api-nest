import { CvCompetenceEntity } from './../../../cv-competence/entities/cv-competence.entity/cv-competence.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

    competences?: CvCompetenceEntity[];

}