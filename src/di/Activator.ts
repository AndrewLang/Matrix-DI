
import { Reflector } from './Reflector';
import * as Models from './Models';
import { KnownKeys } from './KnownKeys';

export class Activator {

    /**
     * 
     * @param type 
     * @param args 
     */
    static Createinstance<T>(type: Models.Type<T>, ...args: any[]): T {
        let factory = Activator.Factory(type);

        return factory(...args);
    }
    /** Factory of creating object instance with arguments */
    public static Factory<T>(t: Models.Type<T>): (...args: any[]) => T {
        return (...args: any[]) => new t(...args);
    }
    /**
     * Get parameters
     * @param type 
     */
    public static GetParameters(type: Models.Type<any>): any[][] {
        // Note: only report metadata if we have at least one class decorator
        // to stay in sync with the static reflector.
        if (!Models.IsType(type)) {
            return [];
        }

        return [];
    }
    /**
     * Get constructor or function name
     * @param func 
     */
    public static GetFunctionName(func: any): string {
        if (func.name) {
            return func.name;
        } else {
            const name = func.toString();
            const match = name.match(/^function\s*([^\s(]+)/);
            return match ? match[1] : `Anonymous function: ${name}`;
        }
    }
    /**
     * 
     * @param constructor 
     */
    public static GetConstructorDescriptors(constructor: Function): Models.IMethodDescriptor[] {
        if (!constructor) {
            throw new Error(`Argument 'constructor' is not valid.`);
        }

        let descriptors = [];

        let metadata = Reflector.GetMetadata(KnownKeys.ParamTypes, constructor);
        let injectData = Reflector.GetInjectableMetadata(constructor);

        let getParaDescriptor = (index: number) => {
            return injectData.find(x => x.Index === index);
        };

        let index = 0;
        for (let item of metadata) {
            let name = Activator.GetFunctionName(item);

            let descriptor: Models.IMethodDescriptor =
                name === 'Object' ?
                    {
                        Name: getParaDescriptor(index).Name,
                        Token: getParaDescriptor(index).Value
                    } :
                    {
                        Name: name,
                        Token: { Token: name },
                        Creator: item
                    };
            descriptors.push(descriptor);
            index++;
        }

        return descriptors;
    }
    /**
     * 
     * @param constructor 
     */
    public static GetConstructorMetadata(constructor: Function): Models.ConstructorMetadata {
        return {
            CompilerData: Reflector.GetFunctionMetadata(constructor),
            UserData: Reflector.GetFunctionTaggedMetadata(constructor) || {}
        };
    }
}