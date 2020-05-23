import {
    Request,
    Response,
    NextFunction
} from "express";
import {ModuleMapper} from "../mappers/ModuleMapper";
import GetPublicModuleFromRepo = ModuleMapper.GetPublicModuleFromRepo;
import {ApiConnections} from "../utils/ApiConnections";
import GetRawGithubContent = ApiConnections.GetRawGithubContent;

export const GetModule = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;
    try {
        const moduleSearch = (await mongo.find('modules', { isPrivate: false, name: req.params.name, 'owner.login': req.params.login }));
        if(moduleSearch.length === 0) return res.sendStatus(404);

        const module = GetPublicModuleFromRepo(moduleSearch[0]);
        const readme = await GetRawGithubContent(
            `${module.login}/${module.name}/${module.branch_name}/README.md`
        );

        res.send({
            ...module,
            readme
        });
    } catch (e) {
        res.sendStatus(404);
    }
}
