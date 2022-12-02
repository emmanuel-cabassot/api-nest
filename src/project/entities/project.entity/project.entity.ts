import { UserEntity } from './../../../user/entites/user.entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';

@Entity('project')
export class ProjectEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'text'
    })
    description: string;

    @Column({
        default: null
    })
    age: number;

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
}
