import 'reflect-metadata';
import { KnownKeys } from './KnownKeys';
import * as Models from './Models';

/**
 * A wrapper of 'reflect-metadata'
 */
export class Reflector {

    /**
     * 
     * @param metadataKey 
     * @param target 
     * @param key 
     */
    static GetMetadata(metadataKey: string, target: any, key?: string | symbol): any {
        let types = Reflect.getMetadata(metadataKey, target, key);

        return types;
    }
    /**
     * 
     * @param metadataKey 
     * @param target 
     * @param key 
     */
    static GetOwnMetadata(metadataKey: string, target: any, key: string): any {
        return Reflect.getOwnMetadata(metadataKey, target, key);
    }
    /**
     * 
     * @param metadataKey 
     * @param metadataValue 
     * @param target 
     * @param propertyKey 
     */
    static DefineMetadata(metadataKey: string, metadataValue: any, target: any, propertyKey?: string) {
        Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    /**
     * 
     * @param metadataKey 
     * @param target 
     */
    static HasOwnMetadata(metadataKey, target): boolean {
        return Reflect.hasOwnMetadata(metadataKey, target);
    }
    /**
     * 
     * @param func 
     */
    static GetFunctionMetadata(func: Function) {
        return Reflector.GetMetadata(KnownKeys.ParamTypes, func);
    }
    /**
     * 
     * @param func 
     */
    static GetFunctionTaggedMetadata(func: Function) {
        return Reflector.GetMetadata(KnownKeys.TaggedTypes, func);
    }
    /**
     * 
     * @param func 
     */
    static GetInjectableMetadata(func: Function): Models.IParameterDescriptor[] {
        let descriptors = [];
        let metadata = Reflector.GetFunctionTaggedMetadata(func);
        for (let item in metadata) {
            let data = metadata[item][0];

            let descriptor: Models.IParameterDescriptor = {
                Index: Number.parseInt(item),
                Name: data.Value.Token,
                Key: data.Key,
                Value: data.Value
            };
            descriptors.push(descriptor);
        }
        return descriptors;
    }

    /**
     * 
     * @param target 
     */
    static RelfectMetadata = (target: any) => {
        if (Reflector.HasOwnMetadata(KnownKeys.ParamTypes, target)) {
            return target;
        }

        let types = Reflector.GetMetadata(KnownKeys.ReflectParamTypes, target) || [];

        Reflector.DefineMetadata(KnownKeys.ParamTypes, types, target);

        return target;
    };
}

export const IsString = (obj: any) => boolean => {
    return typeof obj === 'string';
};