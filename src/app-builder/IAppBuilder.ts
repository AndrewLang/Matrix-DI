import { IDictionary, IServiceProvider, Dictionary, Service, IServiceContainer } from './imports';
import { IComponent } from './IComponent';

export interface IAppBuilder {

    readonly ServiceContainer: IServiceContainer;

    readonly Properties: IDictionary<any, any>;

    readonly Components: IComponent[];

    Use(component: IComponent): IAppBuilder;

    Build(): void;
}

export class AppBuilder implements IAppBuilder {

    private properties = new Dictionary<any, any>();
    private components = new Array<IComponent>();

    constructor(@Service({ Token: 'IServiceContainer' }) private serviceContainer: IServiceContainer) {

    }

    get ServiceContainer(): IServiceContainer {
        return this.serviceContainer;
    }

    get Properties(): IDictionary<any, any> {
        return this.properties;
    }

    get Components(): IComponent[] {
        return this.components;
    }

    Use(component: IComponent): IAppBuilder {
        if (component) {
            this.components.push(component);
        }

        return this;
    }

    Build(): void {
        for (let item of this.components) {
            item.ConfigureServices(this.serviceContainer);
        }

        for (let item of this.components) {
            item.Configure();
        }
    }
}