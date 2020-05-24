import {
    Request,
    Response,
    NextFunction
} from "express";
import {ModuleMapper} from "../mappers/ModuleMapper";
import GetPublicRepoFromRepo = ModuleMapper.GetPublicModuleFromRepo;
import {RepoGraphql} from "../types/graphql/RepoGraphql";
import {ApiConnections} from "../utils/ApiConnections";
import GetGraphql = ApiConnections.GetGraphql;
import {RepoTypes} from "../types/RepoTypes";
import ViewerRepos = RepoTypes.ViewerRepos;
import Repo = RepoTypes.Repo;
import {RepoFilters} from "../filters/RepoFilters";
import IsValidRepo = RepoFilters.IsValidRepo;
import {CryptoUtils} from "../utils/CryptoUtils";
import DecryptText = CryptoUtils.DecryptText;

export const GetRepos = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;

    if(!user) return res.sendStatus(404);

    const getRepositories = async (repositories: any[] = [], nextCursor: string = null): Promise<Repo[]> => {
        const { pageInfo, nodes } = (await GetGraphql<ViewerRepos>(
            // user.token_type,
            // user.access_token,
            //TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SECURITY
            DecryptText(user.token_type),
            DecryptText(user.access_token),
            RepoGraphql.GetRepos(nextCursor)
        )).viewer.repositories;
        const { hasNextPage, endCursor }  = pageInfo;
        repositories.push(...nodes);
        return hasNextPage ? await getRepositories(repositories, endCursor) : repositories;
    }

    res.send(
        (await getRepositories())
            .filter(IsValidRepo)
            .map(GetPublicRepoFromRepo)
    );
}
