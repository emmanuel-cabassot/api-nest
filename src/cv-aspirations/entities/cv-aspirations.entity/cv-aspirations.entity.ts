import { AspirationsEntity } from './../../../aspirations/entities/aspirations.entity/aspirations.entity';
import { CvEntity } from './../../../cv/entities/cv.entitiy/cv.entity';
import { Entity, PrimaryColumn, ManyToOne } from "typeorm";

@Entity("cv_aspirations")
export class CvAspirationsEntity {
    @PrimaryColumn({
        name: "id_cv",
    })
    idCv: number;

    @PrimaryColumn({
        name: "id_aspiration",
    })
    idAspiration: number;

    @ManyToOne(
        () => CvEntity,
        cv => cv.aspirations,
        { onDelete: "CASCADE", onUpdate: "CASCADE" }
    )
    cv: CvEntity;

    @ManyToOne(
        () => AspirationsEntity,
        aspiration => aspiration.cvs,
        { onDelete: "CASCADE", onUpdate: "CASCADE" }
    )
    aspiration: AspirationsEntity;
}