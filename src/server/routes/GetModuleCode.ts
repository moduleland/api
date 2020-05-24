import {
    Request,
    Response,
    NextFunction
} from "express";
import {Utils} from "../utils/Utils";
import GetRandomString = Utils.GetRandomString;
import {ModuleTypes} from "../types/ModuleTypes";
import Module = ModuleTypes.Module;
import {CryptoUtils} from "../utils/CryptoUtils";
import CreateHash = CryptoUtils.CreateHash;

const CodeExpirationTime = 5;

export const GetModuleCode = async (req: Request, res: Response, next: NextFunction) => {
    const { user, mongo } = res.locals;
    try {
        const moduleSearch = (await mongo.find('modules', {
            isPrivate: true,
            id: req.params.id,
            creator_id: user.id
        }));
        if(moduleSearch.length === 0) return res.sendStatus(404);

        const [module]: Module[] = moduleSearch;

        const code = GetRandomString(4).toUpperCase();
        const hashCode = CreateHash(code);
        const expire_at = Date.now() + (1000 * 60 * CodeExpirationTime)

        await mongo.update('modules', 'id', module.id,
            {
                $set: {
                    code: {
                        hash: hashCode,
                        expire_at
                    }
                }
            }
        );

        res.send({
            code,
            expire_at
        });
    } catch (e) {
        // console.log(e)
        res.sendStatus(404);
    }
}
//MDEwOlJlcG9zaXRvcnkyNjQyNDAzNDY=
