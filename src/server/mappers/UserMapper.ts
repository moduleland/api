import {UserTypes} from "../types/UserTypes";
import {ModuleTypes} from "../types/ModuleTypes";
import {ModuleMapper} from "./ModuleMapper";

export namespace UserMapper {

    import User = UserTypes.User;
    import PublicUser = UserTypes.PublicUser;
    import Module = ModuleTypes.Module;
    import GetPublicRepoFromRepo = ModuleMapper.GetPublicModuleFromRepo;

    export const GetPublicUserFromUser = (
        modules: Array<Module>,
        user: User
    ): PublicUser => ({
        modules: modules.map(GetPublicRepoFromRepo),
        avatar_url: user.avatarUrl,
        login: user.login,
        name: user.name,
        url: user.url,
        website_url: user.websiteUrl
    });

}
