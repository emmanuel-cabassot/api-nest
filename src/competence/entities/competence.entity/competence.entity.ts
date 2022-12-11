import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('competence')
export class CompetenceEntity {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        type: 'varchar',
        length: 15,
    })
    name: string;
}