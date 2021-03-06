import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppErros';
class UserController {
    async create(request: Request, response: Response) {
        const {name, email} = request.body;
        const usersRepository = getCustomRepository(UsersRepository);
        //Se fosse SQL PURO: SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const schema = yup.object().shape({
            name: yup.string().required(""),
            email: yup.string().email().required()
        })

        try {
            await schema.validate(request.body, {abortEarly: false});
        }
        catch(err) {
            throw new AppError(err);
        }



        const userAlreadyExists = await usersRepository.findOne({
            email
        })
        if(userAlreadyExists) { // REGRA DE NEGOCIO PARA VER SE O USUÁRIO EXISTE
            throw new AppError("User already exists!");
        }
        const user = usersRepository.create({
            name,email
        })

        await usersRepository.save(user);
        return response.status(201).json(user);
    }
}

export { UserController };
