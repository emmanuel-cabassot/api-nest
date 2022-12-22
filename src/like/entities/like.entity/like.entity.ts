// import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { UserEntity } from 'src/user/entites/user.entity/user.entity';
// import { ProjectEntity } from 'src/project/entities/project.entity/project.entity';

// @Entity()
// export class Like {
//   @Column({ 
//     primary: true,
//     name: 'user_id' })
//   userId: number;

//   @Column({ primary: true,
//     name: 'project_id' })
//   projectId: number;

//   // Define the many-to-one relationship to the User entity
//   @ManyToOne(type => UserEntity, { nullable: false })
//   @JoinColumn({ name: 'user_id' })
//   user: UserEntity;

//   // Define the many-to-one relationship to the Project entity
//   @ManyToOne(type => ProjectEntity, { nullable: false })
//   @JoinColumn({ name: 'project_id' })
//   project: ProjectEntity;
// }