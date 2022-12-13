import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';
import { CompetenceEntity } from './../../../competence/entities/competence.entity/competence.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('project_competence')
export class projectCompetenceEntity {
    @PrimaryColumn({
        name: 'id_project',
    })
    idProject: number;

    @PrimaryColumn({
        name: 'id_competence',
    })
    idCompetence: number;

    @ManyToOne(
        () => ProjectEntity,
        project => project.competences,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'id_project', referencedColumnName: 'id' }])
    project: ProjectEntity;

    @ManyToOne(
        () => CompetenceEntity,
        competence => competence.projects,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , eager: true}
    )
    @JoinColumn([{ name: 'id_competence', referencedColumnName: 'id' }])
    competence: CompetenceEntity;
}