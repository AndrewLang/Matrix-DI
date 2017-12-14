
import * as Common from '../imports';
import { ITalkService } from './ITalkService';

export interface IFakeService {
    Do(): void;
}

@Common.Injectable()
export class FakeService implements IFakeService {
    constructor( @Common.Inject({ Token: 'ITalkService' }) private talkService: ITalkService) {

    }
    Do(): void {
        console.log('Calling Fack Service');

        if (this.talkService) {
            this.talkService.Do();
        } else {
            console.log('Talk service not found');
        }
    }
}