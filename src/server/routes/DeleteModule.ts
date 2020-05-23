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

export const DeleteModule = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;


    const moduleToDelete = await mongo.find('modules', {
        id: req.params.id,
        creator_id: res.locals.user.id
    });
    if(moduleToDelete.length === 0)
        return res.sendStatus(500);

    await mongo.delete('modules', 'id', req.params.id);

    res.sendStatus(200);
}
