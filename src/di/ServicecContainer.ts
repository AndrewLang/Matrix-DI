import { IServiceContainer } from './IServiceContainer';
import { ServiceDescriptor } from './ServiceDescriptor';
import * as Models from './Models';
import { Activator } from './Activator';
import { IServiceProvider } from './IServiceProvider';
import { IDictionary, Dictionary } from './Dictionary';

export class ServicecContainer implements IServiceContainer, IServiceProvider {

    private nameTokenMapping = new Dictionary<string, Models.IServiceToken>();
    private tokenTable = new Dictionary<Models.IServiceToken, ServiceDescriptor>();
    private instanceTable = new Dictionary<Models.IServiceToken, any>();

    constructor() {
        this.Register(ServiceDescriptor.Singleton({ Token: 'IServiceContainer' }).UseInstance(this))
            .Register(ServiceDescriptor.Singleton({ Token: 'IServiceProvider' }).UseInstance(this));
    }

    Register(descriptor: ServiceDescriptor): IServiceContainer {
        if (!descriptor) {
            throw new Error(`Null parameter of 'descriptor'`);
        }

        if (descriptor.Name && descriptor.Token) {
            this.nameTokenMapping.Add(descriptor.Name, descriptor.Token);
        }

        this.tokenTable.Add(descriptor.Token, descriptor);

        return this;
    }

    TryResolve<TService>(serviceToken: Models.IServiceToken): TService {
        if (!serviceToken) {
            return null;
        }
        console.log('====================================================');
        console.log('Start resolve service by')
        console.log(serviceToken);
        console.log();

        let instance = this.ResolveInstanceByToken(serviceToken);


        console.log('====================================================');
        return instance;
    }


    GetService(serviceToken: Models.IServiceToken);
    GetService<T>(serviceToken: Models.IServiceToken): T;
    GetService(serviceToken: any) {
        return this.TryResolve(serviceToken);
    }

    private GetDictionaryValue(dictionary: IDictionary<Models.IServiceToken, any>, token: Models.IServiceToken): any {
        if (dictionary.ContainsKey(token)) {
            return dictionary.Item(token);
        } else {
            console.log('Get service descriptor with');
            console.log(token);
            let data = dictionary.FirstOrDefault(x => x.Key.Token === token.Token);

            console.log(data);
            return data ? data.Value : null;
        }
    }
    private ResolveDependencies(descriptor: ServiceDescriptor): any[] {
        let dependencies = [];

        let descriptors = Activator.GetConstructorDescriptors(descriptor.ImplementationType);
        console.log('Method descriptors');
        console.log(descriptors);
        console.log();

        for (let item of descriptors) {
            console.log("Resolve dependency ")
            console.log(item)
            let dependency = this.ResolveInstanceByMethodDescriptor(item);
           
            console.log(dependency)
            dependencies.push(dependency);
        }

        return dependencies;
    }
    private ResolveInstanceByMethodDescriptor(methodDescriptor: Models.IMethodDescriptor): any {
        if (methodDescriptor.Creator && methodDescriptor.Token) {
            return this.ResolveInstanceByCreator(methodDescriptor.Creator, methodDescriptor.Token);
        } else if (methodDescriptor.Token) {
            return this.ResolveInstanceByToken(methodDescriptor.Token);
        }  
        return null;
    }
    private ResolveInstanceByToken(token: Models.IServiceToken): any {
        let instance = this.GetDictionaryValue(this.instanceTable, token);

        if (instance) {
            return instance;
        }

        console.log('No instance found.');
        console.log();

        let descriptor: ServiceDescriptor = this.GetDictionaryValue(this.tokenTable, token);

        console.log("Service descriptor ")
        console.log();
        console.log(descriptor);
        // console.log(token);
        console.log();
        if (!descriptor) {
            descriptor = new ServiceDescriptor();
            descriptor.Token = token;
            this.tokenTable.Add(token, descriptor);
        }


        return descriptor ? this.ResolveInstanceByDescriptor(descriptor) : null;
    }
    private ResolveInstanceByCreator(creator: Models.Type<any>, token: Models.IServiceToken): any {
        let descriptor = new ServiceDescriptor();
        descriptor.Token = token;
        descriptor.ImplementationType = creator;
        return this.ResolveInstanceByDescriptor(descriptor);
    }
    private ResolveInstanceByDescriptor(descriptor: ServiceDescriptor): any {
        let instance: any;

        if (descriptor.ImplementationInstance) {
            //  resolve instance directly
            instance = descriptor.ImplementationInstance;
            this.instanceTable.Add(descriptor.Token, instance);
        } else if (descriptor.ImplementationFactory) {
            // resolve instance by registered factory
            instance = descriptor.ImplementationFactory(this);
            this.instanceTable.Add(descriptor.Token, instance);
        } else if (descriptor.ImplementationType) {
            // resolve instance by implementation type

            let dependencies = this.ResolveDependencies(descriptor);

            console.log();
            console.log('Dependencies ');
            console.log(dependencies);

            instance = Activator.Createinstance<any>(descriptor.ImplementationType, ...dependencies);

            this.instanceTable.Add(descriptor.Token, instance);
        }

        return instance;
    }
}