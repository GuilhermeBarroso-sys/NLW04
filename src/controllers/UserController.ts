import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
class UserController {
    async create(request: Request, response: Response) {
        const {name, email} = request.body;
        const usersRepository = getCustomRepository(UsersRepository);
        //Se fosse SQL PURO: SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({
            email
        })
        if(userAlreadyExists) { // REGRA DE NEGOCIO PARA VER SE O USUÁRIO EXISTE
            return response.status(400).json({
                error: "User already exists!",
            })
        }
        const user = usersRepository.create({
            name,email
        })

        await usersRepository.save(user);
        return response.status(201).json(user);
    }
}

export { UserController };
