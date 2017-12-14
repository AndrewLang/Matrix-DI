import * as Common from '../imports'
import { MockService } from './IMockService';
import { FakeService } from './IFakeService';
import { ILoggingService } from './ILoggingService';

export interface IExceptionHandlingService {
    Handle(error: any): void;
}

@Common.Injectable()
export class ExceptionLoggingService implements IExceptionHandlingService {

    constructor(
        private mockService: MockService,
        @Common.Inject({ Token: 'ILoggingService' }) private loggingService: ILoggingService,
        private fackService: FakeService
    ) {

    }

    Handle(error: any): void {
        if (this.loggingService) {
            console.log('logging service found')
            this.loggingService.Debug(error);
        } else {
            console.log('Logging service not found.')
        }
        if (this.mockService) {
            this.mockService.Do();
        } else {
            console.log('Mock service not found.');
        }
        if (this.fackService) {
            this.fackService.Do();
        } else {
            console.log('Fack service not found.');
        }

    }
}