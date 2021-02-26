import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from '../errors/AppErros';
class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;
        
        const userRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const user = await userRepository.findOne({email});

        if(!user) {
            throw new AppError("User does not exists");
               
        }


        const survey = await surveysRepository.findOne({id: survey_id,}) // where : id : survey_id

        if(!survey) {
            throw new AppError("Survey does not exists!");
              
        }
        
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id,value: null},
            relations: ["user", "survey"]
        });
        const variables = {
            name: user.name,
            title:survey.title,
            description:survey.description,
            id: "",
            link: process.env.URL_MAIL,
        }
        const npsPath =  resolve(__dirname/*pasta atual*/, "..", "views", "emails", "npsMail.hbs");
        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables,npsPath);
            return response.json(surveyUserAlreadyExists);
        }
        // Salvar as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id : user.id,
            survey_id,
        });
        await surveysUsersRepository.save(surveyUser);
        // Enviar e-mail apra o usuário
        variables.id = surveyUser.id;
        
        await SendMailService.execute(email, survey.title, variables, npsPath);
        
        return response.json(surveyUser);

    }
}

export { SendMailController }