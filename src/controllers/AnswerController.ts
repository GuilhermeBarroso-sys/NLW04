import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppErros';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController {

   /* 
   Route Params => Parametros que compõe a rota
   routes.get("/answers/:value")
   -----------------------------------------------------------
    Query Params => Aqueles parametros utilizados para busca, paginação e etc...
   (parametros não obrigatorios, a app continua funcionando sem eles)
   ?
   chave=valor
   */ 
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser) {
            throw new AppError("Survey user doesn't not exists!");
            
        }
        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);
        return response.json(surveyUser);
    }
    
}

export { AnswerController } 