import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from "express";
import {createNamespace, getNamespace, Namespace} from 'cls-hooked';
import {RequestContext} from "../context/request.context";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {

    public use(req: Request, res: Response, next: NextFunction): any {
        let reqContext = new RequestContext(req, res);

        const namespace: Namespace = getNamespace(RequestContext.NAMESPACE) || createNamespace(RequestContext.NAMESPACE);
        namespace.run(() => {
            namespace.set(RequestContext.TXID, reqContext.id);
            res.setHeader(RequestContext.TXID, reqContext.id);
            if(!(reqContext.request.get(RequestContext.UNIQUE_KEY) === null ||
                    reqContext.request.get(RequestContext.UNIQUE_KEY) === undefined ||
                    reqContext.request.get(RequestContext.UNIQUE_KEY).trim().length === 0)
            ) {
                namespace.set(RequestContext.UNIQUE_KEY, reqContext.request.get(RequestContext.UNIQUE_KEY));
            }else {
                namespace.set(RequestContext.UNIQUE_KEY, RequestContext.uniqueKeyGenerator());
            }
            next();
        });
    }
}