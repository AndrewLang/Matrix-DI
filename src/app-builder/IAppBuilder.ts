import { IDictionary, IServiceProvider, Dictionary, Service, IServiceContainer } from './imports';
import { IComponent } from './IComponent';

export interface IAppBuilder {

    readonly ServiceContainer: IServiceContainer;

    readonly Properties: IDictionary<any, any>;

    Use(component: IComponent): void;

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

    Use(component: IComponent): void {
        if (component) {
            this.components.push(component);
        }
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