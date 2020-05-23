import {graphql} from "@octokit/graphql";
import {default as axios} from "axios";

export namespace ApiConnections {

    export const GetGraphql = async <T>(
        token_type: string,
        access_token: string,
        graphqlString: string
    ): Promise<T> => {
        return await graphql.defaults({
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        })(graphqlString) as T;
    }


    export const GetRawGithubContent = async (path: string, headers?: any) => {
        try {
            return (await axios.get(
                `https://raw.githubusercontent.com/${path}`,
                headers || {}
            )).data;
        } catch (e) {
            return "";
        }
    }

}
