import {RepoTypes} from "./RepoTypes";

export namespace ModuleTypes {

    import Repo = RepoTypes.Repo;

    export type Code = {
        hash: string,
        expire_at: number
    }

    export type Token = {
        id: string
        hash: string;
        created_at: number;
        ip: string; //ip
    }

    export type Module = Repo & {
        creator_id: string;
        code?: Code
        tokens?: Array<Token>
    }

    export type PublicModule = {
        id: string;
        login: string;
        name: string;
        description: string;
        is_private: boolean;
        license: string;
        created_at: Date;
        updated_at: Date;
        primary_language: string;
        branch_name: string;
        release?: {
            tag_name: string;
            is_prerelease: boolean
        };

    }

}
