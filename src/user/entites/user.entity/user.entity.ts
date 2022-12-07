import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';
import { UserRoleEnum } from './../../../enum/user-role.enum';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

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

    @CreateDateColumn({
        update: false,
    })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
