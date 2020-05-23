import {
    Request,
    Response,
    NextFunction
} from "express";
import {ModuleMapper} from "../mappers/ModuleMapper";
import GetPublicModuleFromRepo = ModuleMapper.GetPublicModuleFromRepo;

const lastNumber = 15;

export const GetModulesLast = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;
    const userModules = (await mongo.find('modules', { isPrivate: false }))
        .map(GetPublicModuleFromRepo);
    res.send(userModules.reverse().slice(0, userModules.length > lastNumber ? lastNumber : userModules.length));
}
