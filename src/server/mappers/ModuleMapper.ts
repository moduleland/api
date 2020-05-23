import {RepoTypes} from "../types/RepoTypes";
import {ModuleTypes} from "../types/ModuleTypes";

export namespace ModuleMapper {

    import Repo = RepoTypes.Repo;
    import PublicModule = ModuleTypes.PublicModule;

    export const GetPublicModuleFromRepo = (
        repo: Repo
    ): PublicModule => ({
        id: repo.id,
        login: repo.owner.login,
        name: repo.name,
        is_private: repo.isPrivate,
        created_at: repo.createdAt,
        updated_at: repo.updatedAt,
        primary_language: repo.primaryLanguage ? repo.primaryLanguage.name : '',
        license: repo.licenseInfo ? repo.licenseInfo.name || '' : '',
        description: repo.description || '',
        branch_name: repo.defaultBranchRef?.name || '',
        release: repo.releases.nodes.length > 0
            ? {
                is_prerelease: repo.releases.nodes[0].isPrerelease,
                tag_name: repo.releases.nodes[0].tagName
            } : undefined
    });

}
