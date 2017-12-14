
export interface IMetadata {
    Key: string | number | symbol;
    Value: any;
}

export interface IMethodDescriptor {
    Name: string;
    Token?: any;
    Creator?: IType<any>;
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

export interface IType<T> extends Function {
    new(...args: any[]): T;
}