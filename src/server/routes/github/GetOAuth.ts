import {
    Request,
    Response,
    NextFunction
} from "express";
import {default as axios} from 'axios'
import {OAuthAccessToken} from "../../types/OAuthAccessToken";
import {Utils} from "../../utils/Utils";
import GetRandomString = Utils.GetRandomString;
import {UserGraphql} from "../../types/graphql/UserGraphql";
import {ApiConnections} from "../../utils/ApiConnections";
import GetGraphql = ApiConnections.GetGraphql;
import {UserTypes} from "../../types/UserTypes";
import ViewerUser = UserTypes.ViewerUser;
import {CryptoUtils} from "../../utils/CryptoUtils";
import CreateHash = CryptoUtils.CreateHash;
import EncryptText = CryptoUtils.EncryptText;

export const GetOAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { mongo } = res.locals;
    const code = new URLSearchParams(req.url.split('?')[1]).get('code');

    const oauthAccessToken: OAuthAccessToken = (await axios.post(
        `https://github.com/login/oauth/access_token`,
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )).data;
    if(oauthAccessToken.error)
        return res.sendStatus(500);

    oauthAccessToken.valid_scopes = process.env.GITHUB_SCOPES.split(',')
        .every(e => oauthAccessToken.scope.split(',').some(s => s === e));
    if(!oauthAccessToken.valid_scopes)
        return res.sendStatus(501);

    const user_id = GetRandomString(64);
    let user_token = GetRandomString(64);

    const setCookie = (name: string, value: string) =>
        res.cookie(name, value,
            {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        );
    setCookie('user_id', user_id);
    setCookie('user_token', user_token);
    const { token_type, access_token } = oauthAccessToken;

    const userTokens = {
        user_id,
        user_token: CreateHash(user_token),
        // token_type,
        // access_token
        //TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SECURITY
        token_type: EncryptText(token_type),
        access_token: EncryptText(access_token)
    };

    const validResponse = (pathname: string = '') =>
        res.redirect(`${process.env.WEBSITE_URL}/account${pathname}`);

    try {
        const viewerUser = await GetGraphql<ViewerUser>(token_type, access_token, UserGraphql.GetUser());
        const user = await mongo.get('users', 'id', viewerUser.viewer.id);
        if(user) {
            await mongo.update('users', 'id', viewerUser.viewer.id,
                {
                    $set: userTokens
                }
            );
            return validResponse();
        }
        await mongo.insert('users', {
            ...viewerUser.viewer,
            //TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SECURITY
            email: EncryptText(viewerUser.viewer.email),
            ...userTokens
        });
        validResponse('#welcome');
    } catch (e) {
        console.error(e);
        res.sendStatus(500)
    }
}
