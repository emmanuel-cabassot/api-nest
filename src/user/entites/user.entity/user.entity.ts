import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ProjectEntity } from './../../../project/entities/project.entity/project.entity';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
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
