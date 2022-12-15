import { CompetenceEntity } from './../../../competence/entities/competence.entity/competence.entity';
import { CvEntity } from './../../../cv/entities/cv.entitiy/cv.entity';

import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('cv_competence')
export class CvCompetenceEntity {
    @PrimaryColumn({
        name: 'id_cv',
    })
    idCv: number;

    @PrimaryColumn({
        name: 'id_competence',
    })
    idCompetence: number;

    @ManyToOne(
        () => CvEntity,
        cv => cv.competences,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'id_cv', referencedColumnName: 'id' }])
    cv: CvEntity;

    @ManyToOne(
        () => CompetenceEntity,
        competence => competence.cvs,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , eager: true}
    )
    @JoinColumn([{ name: 'id_competence', referencedColumnName: 'id' }])
    competence: CompetenceEntity;
}
