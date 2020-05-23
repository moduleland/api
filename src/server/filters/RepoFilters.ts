import {RepoTypes} from "../types/RepoTypes";

export namespace RepoFilters {

    const languages = [
        'javascript',
        'typescript',
        'rust',
        'webassembly'
    ]

    import Repo = RepoTypes.Repo;

    export const IsValidRepo = (
        repo: Repo
    ): boolean =>
        repo.primaryLanguage
        && repo.primaryLanguage.name
        && languages.indexOf(repo.primaryLanguage.name.toLowerCase()) > -1;

}
