import {
    Request,
    Response,
    NextFunction
} from "express";
import {UserMapper} from "../mappers/UserMapper";
import GetPublicUserFromUser = UserMapper.GetPublicUserFromUser;

export const GetUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;
    const userModules = await mongo.find('modules', { creator_id: user.id });
    res.send(GetPublicUserFromUser(
        userModules,
        user
    ));
}

export const GetUserByLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { mongo } = res.locals;
    const login = req.params.login;
    try {
        const user = await mongo.get('users', 'login', login);
        if(!user) return res.sendStatus(404);
        const userModules = await mongo.find('modules', { creator_id: user.id });
        res.send(GetPublicUserFromUser(
            userModules,
            user
        ));
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}
