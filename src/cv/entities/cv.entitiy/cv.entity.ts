import { UserEntity } from './../../../user/entites/user.entity/user.entity';
import { CompetenceEntity } from './../../../competence/entities/competence.entity/competence.entity';
import { CvCompetenceEntity } from './../../../cv-competence/entities/cv-competence.entity/cv-competence.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
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
        type: 'text'
    })
    about_me: string;

    @Column()
    available: boolean;

    @OneToMany(
        type => CvCompetenceEntity,
        cvCompetence => cvCompetence.cv,
        { eager: true}
    )
    competences?: CvCompetenceEntity[];

    @ManyToOne(
        type => UserEntity,
        user => user.cvs,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', eager: true }
    )
    user: UserEntity;

}