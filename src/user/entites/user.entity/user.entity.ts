import { CvEntity } from './../../../cv/entities/cv.entitiy/cv.entity';
import { projectUserEntity } from './../../../project-user/entities/project-user.entity/project-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';
import { UserRoleEnum } from './../../../enum/user-role.enum';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    surname: string;

    @Column({
        length: 60,
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
    })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    role: string;

    @Column({nullable: true})
    profileImage: string;

    @Column({
        default: null
    })
    refresh_token: string;

    @OneToMany(
        type => ProjectEntity,
        project => project.user,
        {
            // cascade: true,
            nullable: true
        }
    )
    projects: ProjectEntity[];

    @OneToMany(
        type => projectUserEntity,
        projectUser => projectUser.user,
        {
            // cascade: true,
            nullable: true
        }
    )
    projectUsers: projectUserEntity[];

    @OneToMany(
        type => CvEntity,
        cv => cv.user,
        {
            // cascade: true,
            nullable: true
        }
    )
    cvs: CvEntity[];

    @CreateDateColumn({
        update: false,
    })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
