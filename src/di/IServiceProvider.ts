

import { IServiceToken } from './index';

export interface IServiceProvider {
    GetService(serviceToken: IServiceToken): any;
    GetService<T>(serviceToken: IServiceToken): T;
}