import * as Common from './imports';
import 'mocha';
import { expect, should } from 'chai';


describe('ServiceDescriptor', () => {

    it('Signalton should return instance', () => {
        let descriptor = Common.ServiceDescriptor.Singleton({ Token: 'test' });
        expect(descriptor).to.not.be.equals(null);        
    });
});