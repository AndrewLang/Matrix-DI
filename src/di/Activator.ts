
import { Reflector } from './Reflector';
import * as Models from './Models';
import { KnownKeys } from './KnownKeys';

/**
 * Used to create instance, get object metadata etc.
 */
export class Activator {

    /**
     * Create instance
     * @param type typeof object
     * @param args arguments
     */
    static Createinstance<T>(type: Models.Type<T>, ...args: any[]): T {
        let factory = Activator.Factory(type);

        return factory(...args);
    }
    
    /**
     * Factory of creating object instance with arguments
     * @param ctor type of given object 
     */
    public static Factory<T>(ctor: Models.Type<T>): (...args: any[]) => T {
        return (...args: any[]) => new ctor(...args);
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
   
}