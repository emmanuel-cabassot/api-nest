import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';
import { UserRoleEnum } from './../../../enum/user-role.enum';
import { Exclude } from 'class-transformer';

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

    @Column()
    @Exclude()
    salt: string;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    role: string;

    @CreateDateColumn({
        update: false,
    })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;


    @OneToMany(
        type => ProjectEntity,
        project => project.user,
        {
            // cascade: true,
            nullable: true
        }
    )
    projects: ProjectEntity[];
}
