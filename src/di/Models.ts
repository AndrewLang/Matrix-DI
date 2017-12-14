
export interface IMetadata {
    Key: string | number | symbol;
    Value: any;
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

export interface IServiceToken {
    Token: string | symbol;
}

export interface Type<T> extends Function {
    new(...args: any[]): T;
}