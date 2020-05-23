import {ModuleTypes} from "./ModuleTypes";
import {RepoTypes} from "./RepoTypes";

export namespace UserTypes {

    import PublicModule = ModuleTypes.PublicModule;

    export interface PublicUser {
        modules: Array<PublicModule>;
        //-----------//
        login: string
        name: string
        avatar_url: string
        url: string
        website_url: string
    }

    export interface User {
        user_id: string
        user_token: string
        access_token: string
        token_type: string

        //-----------//

        id: string
        login: string
        name: string
        email: string
        avatarUrl: string
        location: string
        url: string
        websiteUrl: string
        pullRequests: {
            totalCount: number
        }
        repositories: {
            totalDiskUsage: number
            totalCount: number
        }
        organizations: {
            totalCount: number
            nodes: [{
                "id": string
                "login": string
                "viewerCanAdminister": boolean
            }]
        }
    }

    export type ViewerUser = {
        viewer: User
    }

}
