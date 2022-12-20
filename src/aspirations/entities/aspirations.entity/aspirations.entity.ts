import { CvAspirationsEntity } from './../../../cv-aspirations/entities/cv-aspirations.entity/cv-aspirations.entity';
import { CvEntity } from './../../../cv/entities/cv.entitiy/cv.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('aspirations')
export class AspirationsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    cvs?: CvAspirationsEntity[];

}