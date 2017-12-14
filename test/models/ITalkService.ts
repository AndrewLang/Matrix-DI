import * as Common from '../imports'

export interface ITalkService {
    Do(): void;
}
@Common.Injectable()
export class TalkService implements ITalkService {
    Do(): void {
        console.log(`Talking service...`);
    }
}