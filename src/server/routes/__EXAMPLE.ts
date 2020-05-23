import {
    Request,
    Response,
    NextFunction
} from "express";
import axios from 'axios'

export const __EXAMPLE = async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200)
}
