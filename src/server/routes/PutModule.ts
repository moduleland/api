import {
    Request,
    Response,
    NextFunction
} from "express";
import {RepoGraphql} from "../types/graphql/RepoGraphql";
import {ApiConnections} from "../utils/ApiConnections";
import GetGraphql = ApiConnections.GetGraphql;
import {RepoTypes} from "../types/RepoTypes";
import SearchRepo = RepoTypes.SearchRepo;

export const PutModule = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;

    const { login, module } = req.body;

    const searchRepo = await GetGraphql<SearchRepo>(
        user.token_type,
        user.access_token,
        RepoGraphql.GetRepo(login, module)
    );
    try {
        const module_db = await mongo.get('modules', 'id', searchRepo.repository.id);
        if(module_db) return res.sendStatus(500);

        await mongo.insert('modules', {
            ...searchRepo.repository,
            creator_id: user.id
        });
    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }

    res.sendStatus(200);
}
