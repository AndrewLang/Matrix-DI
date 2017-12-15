
import { ServiceDescriptor } from './ServiceDescriptor';
import * as Models from './Models';

export interface IServiceContainer {

    /**
     * Register a service descriptor
     */
    Register(descriptor: ServiceDescriptor): IServiceContainer;
    /**
     * Register singleon service descriptor
     */
    Singleton(token: Models.IServiceToken): ServiceDescriptor;
    /**
     * Register tranient service descriptor
     */
    Transient(token: Models.IServiceToken): ServiceDescriptor;

    /**
     * Resolve instance
     */
    Resolve<T>(token: Models.IServiceToken | string): T;
}