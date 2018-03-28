import { IServiceContainer, IServiceProvider } from "../index";

export interface IComponent {
    
    ConfigureServices(services: IServiceContainer): void;

    Configure(serviceProvider: IServiceProvider): void;
}