import * as Common from '../imports';

export interface IMockService {
    Do(): void;
}

@Common.Injectable()
export class MockService implements IMockService {
    Do(): void {
        console.log('Mock service do');
    }
}