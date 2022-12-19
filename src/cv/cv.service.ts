import { CvEntity } from './entities/cv.entitiy/cv.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CvService {
    constructor(
        @InjectRepository(CvEntity)
        private readonly cvRepository: Repository<CvEntity>,
    ) { }

    async findAll() {

        return await this.cvRepository.find();
    }

    async findAllCvByUser(user: any) {
        // recupere l'id du user
        const { id } = user;
        // recherche des cv du user
        const myCvs =  await this.cvRepository.find({ where: { user: id } });
        // Si l'utilisateur n'a pas de cv, on renvoie une erreur
        if (!myCvs) {
            throw new HttpException('You have no cv', 404);
        }
        return await this.cvRepository.find({ where: { user } });
    }

   async addCv(cv, user) {
        cv.user = user;

        return await this.cvRepository.save(cv);
    }

    async deleteCv(id: number, user) {
        console.log('id : ', id)
        const cv = await this.cvRepository.findOne({ where: { id }});
        console.log('cv : ', cv)
        if (!cv) {
            console.log('cv not found')
            throw new HttpException('Project not found', 404);
        }
        // Si l'utilisateur n'est pas l'auteur du cv ou admin, on renvoie une erreur
        if (cv.user.id !== user.id && user.role !== 'admin') {
            throw new HttpException('You are not the author of this cv', 403);
        }
        return await this.cvRepository.delete(id);
    }

    async updateCv(id: number, cv, user) {
        // recupere le cv
        const cvToUpdate = await this.cvRepository.findOne({ where: { id }});
        // Si le cv n'existe pas, on renvoie une erreur
        if (!cvToUpdate) {
            throw new HttpException('Cv not found', 404);
        }
        // Si l'utilisateur n'est pas l'auteur du cv ou admin, on renvoie une erreur
        if (cvToUpdate.user.id !== user.id && user.role !== 'admin') {
            throw new HttpException('You are not the author of this cv', 403);
        }
 
        // On met à jour le cv
        await this.cvRepository.update(id, cv);
        // On renvoie le cv mis à jour
        return await this.cvRepository.findOne({ where: { id }});
    }
}
