import { IDictionary } from './imports';

export interface IMiddlewareContext {
    Properties?: IDictionary<any, any>;
    Tag?: any;
}

export interface IMiddleware {
    //Delegate: (context: IMiddlewareContext) => Promise<any>;
    Context?: IMiddlewareContext;
    Next?: IMiddleware;
    Block?: DelegateBlock;
}

export type DelegateBlock = (context: IMiddlewareContext, next?: DelegateBlock) => Promise<any>;

