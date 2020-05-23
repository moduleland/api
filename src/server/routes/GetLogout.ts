import {
    Request,
    Response,
    NextFunction
} from "express";
import axios from 'axios'

export const GetLogout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('user_id');
    res.clearCookie('user_token');
    res.redirect(process.env.WEBSITE_URL);
}
