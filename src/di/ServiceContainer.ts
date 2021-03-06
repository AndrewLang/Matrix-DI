import { IServiceContainer } from './IServiceContainer';
import { ServiceDescriptor } from './ServiceDescriptor';
import * as Models from './Models';
import { Activator } from './Activator';
import { Reflector, IsString } from './Reflector';
import { IServiceProvider } from './IServiceProvider';
import { IDictionary, Dictionary } from './imports';

export class ServiceContainer implements IServiceContainer, IServiceProvider {

    private nameTokenMapping = new Dictionary<string, Models.IServiceToken>();
    private tokenTable = new Dictionary<Models.IServiceToken, ServiceDescriptor>();
    private instanceTable = new Dictionary<Models.IServiceToken, any>();
    private descriptorPreBuffer = [];

    constructor() {
        this.Initialize();
    }

    /**
     * Register a service descriptor
     */
    Register(descriptor: ServiceDescriptor): IServiceContainer {
        if (!descriptor) {
            throw new Error(`Null parameter of 'descriptor'`);
        }

        this.EnsureInjectable(descriptor);
        /** should check Injectable attribute */
        if (descriptor.Name && descriptor.Token) {
            this.nameTokenMapping.Add(descriptor.Name, descriptor.Token);
        }

        this.tokenTable.Add(descriptor.Token, descriptor);

        return this;
    }
    /**
     * 
     * @param token 
     */
    Singleton(token: Models.IServiceToken): ServiceDescriptor {
        let descriptor = ServiceDescriptor.Singleton(token);
        descriptor.Scope = 'Singleton';
        this.descriptorPreBuffer.push(descriptor);
        return descriptor;
    }
    /**
     * 
     * @param token 
     */
    Transient(token: Models.IServiceToken): ServiceDescriptor {
        let descriptor = ServiceDescriptor.Transient(token);
        descriptor.Scope = 'Transient';
        this.descriptorPreBuffer.push(descriptor);
        return descriptor;
    }

    /**
     * Resolve instance
     */
    Resolve<T>(token: Models.IServiceToken | string): T {
        return this.ResolveInternal<T>(token);
    }



    GetService(serviceToken: Models.IServiceToken);
    GetService<T>(serviceToken: Models.IServiceToken): T;
    GetService(serviceToken: any) {
        return this.Resolve(serviceToken);
    }


    private Initialize(): void {
        this.Register(ServiceDescriptor.Singleton({ Token: 'IServiceContainer' }).UseInstance(this))
            .Register(ServiceDescriptor.Singleton({ Token: 'IServiceProvider' }).UseInstance(this));
    }
    private ResolveInternal<T>(token: Models.IServiceToken | string): T {
        this.RegisterDescriptors();

        if (typeof token === 'string') {
            return this.TryResolveByName(token);
        } else {
            return this.TryResolve(token);
        }
    }
    /**
    * Resolve instance by name
    */
    private TryResolveByName<T>(name: string): T {
        if (!name) {
            throw new Error(`Null parameter of 'name'`);
        }

        if (this.nameTokenMapping.ContainsKey(name)) {
            let token = this.nameTokenMapping.Item(name);

            return this.Resolve<T>(token);
        }

        return null;
    }
    private TryResolve<TService>(serviceToken: Models.IServiceToken): TService {
        if (!serviceToken) {
            return null;
        }

        let instance = this.ResolveInstanceByToken(serviceToken);
        return instance;
    }
    private RegisterDescriptors(): void {        
        if (this.descriptorPreBuffer && this.descriptorPreBuffer.length > 0) {
            for (let item of this.descriptorPreBuffer) {
                this.Register(item);
            }

            this.descriptorPreBuffer = [];
        }
    }
    private GetDictionaryValue(dictionary: IDictionary<Models.IServiceToken, any>, token: Models.IServiceToken): any {
        if (dictionary.ContainsKey(token)) {
            return dictionary.Item(token);
        } else {
            let data = dictionary.FirstOrDefault(x => x.Key.Token === token.Token);

            return data ? data.Value : null;
        }
    }
    private ResolveDependencies(descriptor: ServiceDescriptor): any[] {
        let dependencies = [];

        let descriptors = Activator.GetConstructorDescriptors(descriptor.ImplementationType);

        for (let item of descriptors) {
            let dependency = this.ResolveInstanceByMethodDescriptor(item);

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
        let descriptor: ServiceDescriptor = this.GetDictionaryValue(this.tokenTable, token);

        if (descriptor.Scope == 'Transient') {
            return this.ResolveTransient(descriptor, token);
        } else if (descriptor.Scope == 'Singleton') {
            return this.ResolveSingleton(descriptor, token);
        }

        throw new Error('Unsupported scope ');
    }
    private ResolveTransient(descriptor: ServiceDescriptor, token: Models.IServiceToken): any {
        let dependencies = this.ResolveDependencies(descriptor);

        return Activator.Createinstance<any>(descriptor.ImplementationType, ...dependencies);

    }
    private ResolveSingleton(descriptor: ServiceDescriptor, token: Models.IServiceToken): any {
        let instance = this.GetDictionaryValue(this.instanceTable, token);

        if (instance) {
            return instance;
        }

        if (!descriptor) {
            descriptor = new ServiceDescriptor();
            descriptor.Token = token;
            this.tokenTable.Add(token, descriptor);
        }

        return descriptor ? this.ResolveInstanceByDescriptor(descriptor) : null;
    }
    private ResolveInstanceByCreator(creator: Models.IType<any>, token: Models.IServiceToken): any {
        let descriptor = new ServiceDescriptor();
        descriptor.Token = token;
        descriptor.ImplementationType = creator;
        return this.ResolveInstanceByDescriptor(descriptor);
    }
    private ResolveInstanceByDescriptor(descriptor: ServiceDescriptor): any {
        let instance: any;

        if (descriptor.ImplementationInstance) {
            instance = descriptor.ImplementationInstance;
            this.instanceTable.Add(descriptor.Token, instance);
        } else if (descriptor.ImplementationFactory) {
            instance = descriptor.ImplementationFactory(this);
            this.instanceTable.Add(descriptor.Token, instance);
        } else if (descriptor.ImplementationType) {
            let dependencies = this.ResolveDependencies(descriptor);

            instance = Activator.Createinstance<any>(descriptor.ImplementationType, ...dependencies);

            this.instanceTable.Add(descriptor.Token, instance);
        }

        return instance;
    }
    private EnsureInjectable(descriptor: ServiceDescriptor): void {
        if (!descriptor.ImplementationType) {
            return;
        }

        Reflector.RelfectMetadata(descriptor.ImplementationType);
    }
}