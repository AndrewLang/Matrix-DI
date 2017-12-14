import * as Common from '../imports';


export interface ILoggingService {
    Debug(message: string): void;
}

@Common.Injectable()
export class LoggingService implements ILoggingService {
    Debug(message: string): void {
        console.log(message);
    }
}