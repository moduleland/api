import {
    Request,
    Response,
    NextFunction
} from "express";
import {ModuleMapper} from "../mappers/ModuleMapper";
import GetPublicModuleFromRepo = ModuleMapper.GetPublicModuleFromRepo;

export const GetSearch = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;
    try {
        const moduleSearch = (await mongo.find('modules', {
            isPrivate: false,
            $or: [
                {
                    name: { $regex: req.params.params }
                },
                {
                    'owner.login': { $regex: req.params.params }
                }
            ]
        }));
        res.send(moduleSearch.map(GetPublicModuleFromRepo));
    } catch (e) {
        res.send([]);
    }
}
