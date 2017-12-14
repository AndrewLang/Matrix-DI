import { Reflector } from './Reflector';

import * as Models from './Models';
import { KnownKeys } from './KnownKeys';

import 'reflect-metadata';



export const DecorateParameter = (target: any, property: string, index: number, metadata: Models.Metadata) => {
    const metadataKey = KnownKeys.TaggedTypes;
    // _tagParameterOrProperty(metadataKey, target, property, metadata, index);

    let paramsMetadata = {};
    const isParameterDecorator = (typeof index === "number");
    const key: string = (index !== undefined && isParameterDecorator) ? index.toString() : property;

    // if the decorator is used as a parameter decorator, the property name must be provided
    if (isParameterDecorator && property !== undefined) {
        throw new Error('Invalid operation');
    }

    // read metadata if available
    if (Reflector.HasOwnMetadata(metadataKey, target)) {
        paramsMetadata = Reflector.GetMetadata(metadataKey, target);
    }

    // get metadata for the decorated parameter by its index
    let metadatas: Models.Metadata[] = paramsMetadata[key];

    if (!Array.isArray(metadatas)) {
        metadatas = [];
    } else {
        for (let item of metadatas) {
            if (item.Key === metadata.Key) {
                throw new Error(`Metadata key was used more than once in a parameter: ${item.Key}`);
            }
        }
    }

    // set metadata
    metadatas.push(metadata);
    paramsMetadata[key] = metadatas;
    Reflector.DefineMetadata(metadataKey, paramsMetadata, target);
}

export const Injectable = () => {
    return (target: any) => {
        if (Reflector.HasOwnMetadata(KnownKeys.ParamTypes, target)) {
            throw new Error('Cannot apply @Injectable decorator multiple times.');
        }

        let types = Reflector.GetMetadata(KnownKeys.ReflectParamTypes, target) || [];
        // console.log('Injectable')
        // console.log(types);
        // for(let item in types){
        //     console.log(item);
        //     console.log(types[item].toString());
        // }
        
        Reflector.DefineMetadata(KnownKeys.ParamTypes, types, target);

        return target;
    };
}
export const Inject = (token: Models.IServiceToken) => {
    return function (target: any, targetKey: string, index?: number): void {

        let metadata = { Key: KnownKeys.InjectTag, Value: token };

        if (typeof index === "number") {
            // console.log('tag parameter with');
            // console.log(`${target}, ${targetKey}, ${index}, ${JSON.stringify(metadata)}`);

            DecorateParameter(target, targetKey, index, metadata);
        }
    };
}

export const ServiceTokenKey = 'MatrixServiceToken';
export const Service = function (token: string) {
    return function (target: object, property: string, index: number) {
        let data = Reflector.GetOwnMetadata(ServiceTokenKey, target, property);
        if (!data) {
            Reflector.DefineMetadata(ServiceTokenKey, token, target, property);
        }
    }
};
export const GetServiceToken = (target, property) => {
    let data = Reflector.GetOwnMetadata(ServiceTokenKey, target, property);
    let ctor: FunctionConstructor;
    Symbol.for('');
    return data;
}