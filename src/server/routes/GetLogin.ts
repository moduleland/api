import {
    Request,
    Response,
    NextFunction
} from "express";

export const GetLogin = (req: Request, res: Response, next: NextFunction) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=${process.env.GITHUB_SCOPES}`)
}
