export interface IMiddleware {
    Invoke(context: any): Promise<any>;
}