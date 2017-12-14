
export interface Metadata {
    Key: string | number | symbol;
    Value: any;
}

export interface MetadataMap {
    [name: string]: Metadata[];
}

export interface ConstructorMetadata {
    CompilerData: Function[] | undefined;
    UserData: MetadataMap;
}

export interface IMethodDescriptor {
    Name: string;
    Token?: any;
    Creator?: Type<any>;
}
export interface IParameterDescriptor {
    Index: number;
    Name: string;
    Key: string;
    Value: any;
}
export interface Newable<T> {
    new(...args: any[]): T;
}

export interface IServiceToken {
    Token: string | symbol;
}

export const Type = Function;

export function IsType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export interface Type<T> extends Function {
    new(...args: any[]): T;
}