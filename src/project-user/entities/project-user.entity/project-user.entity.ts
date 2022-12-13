import { MemberRoleEnum } from './../../../enum/member-role.enum';
import { UserEntity } from './../../../user/entites/user.entity/user.entity';
import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';

import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
@Entity('project_user')
export class projectUserEntity {

    @PrimaryColumn({
        name: 'id_project',
    })
    idProject: number;

    @PrimaryColumn({
        name: 'id_user',
    })
    idUser: number;

    @Column({
        type: 'enum',
        enum: MemberRoleEnum,
        default: MemberRoleEnum.USER
    })
    role: string;

    @ManyToOne(
        () => ProjectEntity,
        project => project.projectUsers,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'id_project', referencedColumnName: 'id' }])
    project: ProjectEntity;

    @ManyToOne(
        () => UserEntity,
        user => user.projectUsers,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' , eager: true}
    )
    @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
    user: UserEntity;
}