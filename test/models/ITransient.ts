
import * as Common from '../imports';
import { ITalkService } from './ITalkService';

function GenerateId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export interface ITransient {
    GetId(): string;
}

@Common.Injectable()
export class Transient implements ITransient {
    id: string
    constructor() {
        this.id = GenerateId();
    }

    GetId(): string {
        return this.id;
    }
}

@Common.Injectable()
export class TransientClient {

    constructor( @Common.Inject({ Token: 'ITransient' }) private transient: ITransient, ) {

    }

    GetDate(): string {
        return this.transient.GetId();
    }
}