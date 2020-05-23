
import * as Express from 'express';
import {GetLogin} from "./routes/GetLogin";
import {GetOAuth} from "./routes/github/GetOAuth";
import * as cookieParser from 'cookie-parser';
import {GetUser, GetUserByLogin} from "./routes/GetUser";
import {NextFunction, Request, Response} from "express";
import {Utils} from "./utils/Utils";
import VerifyHash = Utils.VerifyHash;
import {GetRepos} from "./routes/GetRepos";
import GetDateFormat = Utils.GetDateFormat;
import * as Mongo from 'mongo-redux'
import {PutModule} from "./routes/PutModule";
import {urlencoded, json} from "body-parser";
import {GetLogout} from "./routes/GetLogout";
import {GetModulesLast} from "./routes/GetModulesLast";
import {GetModule} from "./routes/GetModule";
import {DeleteModule} from "./routes/DeleteModule";
import {GetSearch} from "./routes/GetSearch";
import {GetModuleCode} from "./routes/GetModuleCode";

export class Server {

    public readonly app: Express.Application;
    public readonly apiRouter: Express.Router;
    public readonly mongo: Mongo;

    constructor() {
        this.mongo = new Mongo();
        this.app = Express();
        this.app.use(json());
        this.app.use(urlencoded({ extended: false }));
        this.app.use(cookieParser())
        this.app.use(this.ignoreCORS);
        this.apiRouter = Express.Router();
        this.route();
        this.connectMongo();
    }

    private connectMongo = async () => {
        try {
            await this.mongo.connect({
                url: process.env.MONGO_STRING,
                name: process.env.MONGO_DATABASE
            });
            console.log('db ready!')
            this.app.listen(parseInt(process.env.PORT || '80'), '0.0.0.0', this.onStart)
        } catch (e) {
            console.error(e)
        }
    }

    private onStart = () => {
        console.log(`running on port ${process.env.PORT}`)
    }

    private route = () => {
        this.app.use(this.mongoConnection)
        this.app.use('/api', this.apiRouter);

        // api/...
        this.apiRouter.get('/login',                     GetLogin);
        this.apiRouter.get('/user',         this.isAuth, GetUser);
        this.apiRouter.get('/user/:login',               GetUserByLogin);
        this.apiRouter.get('/repos',        this.isAuth, GetRepos);

        this.apiRouter.get('/module/code/:id',      this.isAuth, GetModuleCode);
        this.apiRouter.get('/module/tokens/:id',    this.isAuth);
        this.apiRouter.delete('/module/token/:id',    this.isAuth);

        this.apiRouter.get('/module/:login/:name',  GetModule);
        this.apiRouter.get('/modules/last',         GetModulesLast);
        this.apiRouter.get('/search/:params',       GetSearch);

        this.apiRouter.put('/module',               this.isAuth, PutModule);
        this.apiRouter.delete('/module/:id',        this.isAuth, DeleteModule);

        this.apiRouter.get('/logout',       GetLogout);
        // this.apiRouter.get('/repos/:user_id', this.isAuth, GetRepos);

        // api/github/...
        const githubRouter = Express.Router();
        this.apiRouter.use('/github', githubRouter);

        githubRouter.get('/oauth',  GetOAuth);
    }

    private mongoConnection = async (req: Request, res: Response, next: NextFunction) => {
        res.locals.mongo = this.mongo;
        next();
    }

    private isAuth = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id, user_token } = req.cookies;
        if(!user_id || !user_token) return res.sendStatus(401);
        try {
            res.locals.user = await this.mongo.get('users', 'user_id', user_id);
            if(!VerifyHash(user_token, res.locals.user.user_token)) return res.sendStatus(401);
            next()
        } catch (e) {
            res.sendStatus(500);
        }
    }

    private ignoreCORS = (req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', process.env.WEBSITE_URL);
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS, DELETE')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        console.log(GetDateFormat(), '>', req.method, req.path);
        next();
    }

}
