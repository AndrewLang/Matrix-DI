
import { ServiceDescriptor } from './ServiceDescriptor';

export interface IServiceContainer { 

    /** Add service descriptor */
    Register(descriptor: ServiceDescriptor): IServiceContainer;
}