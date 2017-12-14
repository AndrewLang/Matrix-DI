import * as Common from './imports';
import 'mocha';
import { expect, should } from 'chai';


describe('ServiceDescriptor', () => {

    it('', () => {

    });

    it('Signalton should return instance', () => {
        let descriptor = Common.ServiceDescriptor.Singleton({ Token: 'test' });
        expect(descriptor).to.not.be.equals(null);
    });

    it('Should has name', () => {
        let descriptor = Common.ServiceDescriptor.Singleton({ Token: 'test' })
            .WithName('Great');
        expect(descriptor).to.not.be.equals(null);
        expect(descriptor.Name).be.equals('Great');

    });
    it('Should has instance', () => {
        let descriptor = Common.ServiceDescriptor.Singleton({ Token: 'test' })
            .UseInstance({ Name: 'Great' });

        expect(descriptor).to.not.be.equals(null);
        expect(descriptor.ImplementationInstance).to.not.be.equals(null);
        expect(descriptor.ImplementationInstance.Name).be.equals('Great');
    });
    it('Shold has factory', () => {
        let descriptor = Common.ServiceDescriptor.Singleton({ Token: 'test' })
            .UseFactory(() => { return { Name: 'Great' }; });

        expect(descriptor).to.not.be.equals(null);
        expect(descriptor.ImplementationFactory).to.not.be.equals(null);
        expect(descriptor.ImplementationFactory().Name).be.equals('Great');
    });
    it('Should has type', () => {

        class Test{ }

        let descriptor = Common.ServiceDescriptor.Singleton({ Token: 'test' })
            .UseType(Test);

        expect(descriptor).to.not.be.equals(null);
        expect(descriptor.ImplementationType).to.not.be.equals(null);
        
    });
});