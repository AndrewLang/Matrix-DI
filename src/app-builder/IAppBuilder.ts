import { IMiddleware, IMiddlewareContext, DelegateBlock } from './IMiddleware';
import { IDictionary, IServiceProvider, Dictionary, Service } from './imports';


export interface IAppBuilder {

    readonly ServiceProvider: IServiceProvider;

    readonly Properties: IDictionary<any, any>;

    Use(block: DelegateBlock): IAppBuilder;

    Build(): IMiddleware;
}

export class AppBuilder implements IAppBuilder {

    private properties = new Dictionary<any, any>();
    private middlewares = new Array<DelegateBlock>();

    constructor( @Service({ Token: 'IServiceProvider' }) private serviceProvider: IServiceProvider) {

    }

    get ServiceProvider(): IServiceProvider {
        return this.serviceProvider;
    }

    get Properties(): IDictionary<any, any> {
        return this.properties;
    }

    Use(block: DelegateBlock): IAppBuilder {
        if (block) {
            this.middlewares.push(block);
        }
        return this;
    }
    Build(): IMiddleware {
        let entry: IMiddleware = {};// this.Entry;

        let current = entry;
        for (let item of this.middlewares) {
            current.Block = item;
            let next: IMiddleware = {};
            current.Next = next;
            current = next;
        }
        return entry;
    }

    private async Entry(context: IMiddlewareContext, next: DelegateBlock) { }
}