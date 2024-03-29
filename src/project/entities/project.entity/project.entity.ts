import { projectCompetenceEntity } from './../../../project-competence/entities/project-competence.entity/project-competence.entity';
import { projectUserEntity } from './../../../project-user/entities/project-user.entity/project-user.entity';
import { CompetenceEntity } from './../../../competence/entities/competence.entity/competence.entity';
import { UserEntity } from './../../../user/entites/user.entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';

@Entity('project')
export class ProjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'text'
    })
    shortDescription: string;

    @Column({
        type: 'text'
    })
    description: string;

    @Column({
        default: null
    })
    age: number;

    @Column({
        default: "switch3415c855-02fc-4371-9154-730beeb60595.png"
    })
    projectImage: string;

    @Column({
        default: false
    })
    isOnLineProject: boolean;

    @Column({
        default: false
    })
    isSearchPersonn: boolean;

    @CreateDateColumn({
        update: false,
    })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(
        type => UserEntity,
        user => user.projects,
        {
            nullable: true,
            eager: true
        }
    )
    user: UserEntity;

    
    @OneToMany(
        type => projectCompetenceEntity,
        projectCompetence => projectCompetence.project,
        {eager: true}
    )
    competences?: CompetenceEntity[];

    @OneToMany(
        type => projectUserEntity,
        projectUser => projectUser.project,
        {
            // cascade: true,
            nullable: true,
            eager: true
        }
    )
    projectUsers: projectUserEntity[];

    @ManyToMany(
        type => UserEntity,
        user => user.likedProjects,
        {
            // cascade: true,
        })
      likedBy: UserEntity[];

      @ManyToMany(
        type => UserEntity,
        user => user.favoriteProjects,
        {
            // cascade: true,
        })
      favoriteBy: UserEntity[];
}
