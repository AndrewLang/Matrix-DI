import * as Models from './Models';
import { IServiceProvider } from './IServiceProvider';


export class ServiceDescriptor {
    Name: string;
    Token: Models.IServiceToken;    
    ImplementationType: Models.Type<any>;
    ImplementationInstance: any;
    ImplementationFactory: (serviceProvider?: any) => any;

    WithName(name: string): ServiceDescriptor {
        this.Name = name;
        return this;
    }
    UseInstance(instance: any): ServiceDescriptor {
        this.ImplementationInstance = instance;
        return this;
    }
    UseFactory(factory: (serviceProvider?: IServiceProvider) => any): ServiceDescriptor {
        this.ImplementationFactory = factory;
        return this;
    }
    UseType(implementationType: Models.Type<any>): ServiceDescriptor {
        this.ImplementationType = implementationType;
        return this;
    }

    
    static Singleton(token: Models.IServiceToken): ServiceDescriptor {
        let descriptor = new ServiceDescriptor();
        descriptor.Token = token;        
        return descriptor;
    }


}