import { Reflector } from './Reflector';
import * as Models from './Models';
import { KnownKeys } from './KnownKeys';

import 'reflect-metadata';



export const DecorateParameter = (target: any, property: string, index: number, metadata: Models.IMetadata) => {
    const metadataKey = KnownKeys.TaggedTypes;


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
    let metadatas: Models.IMetadata[] = paramsMetadata[key];

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

const InjectableBody = (target: any) => {
    if (Reflector.HasOwnMetadata(KnownKeys.ParamTypes, target)) {
        throw new Error('Cannot apply @Injectable decorator multiple times.');
    }

    let types = Reflector.GetMetadata(KnownKeys.ReflectParamTypes, target) || [];

    Reflector.DefineMetadata(KnownKeys.ParamTypes, types, target);

    return target;
};
/**
 * Injectable decorator used to mark a class as injectable
 */
export const Injectable = () => {
    return InjectableBody;
}


export const Inject = (token: Models.IServiceToken) => {
    return (target: any, targetKey: string, index?: number) => {

        let metadata = { Key: KnownKeys.InjectTag, Value: token };

        if (typeof index === "number") {
            DecorateParameter(target, targetKey, index, metadata);
        }
    };
}
/**
 * Same as Inject decorator, use it as an alias
 */
export const Service = Inject;