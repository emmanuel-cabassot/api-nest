import { CompetenceEntity } from './../../../competence/entities/competence.entity/competence.entity';
import { CvCompetenceEntity } from './../../../cv-competence/entities/cv-competence.entity/cv-competence.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
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

    @ManyToMany(
        () => CompetenceEntity, 
        competence => competence.cvs, //optional
        {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
        @JoinTable({
          name: 'cv_competence',
          joinColumn: {
            name: 'id_cv',
            referencedColumnName: 'id',
          },
          inverseJoinColumn: {
            name: 'id_competence',
            referencedColumnName: 'id',
          },
        })
    competences?: CompetenceEntity[];

}