import * as Common from './imports';
import 'mocha';
import { expect } from 'chai';


describe('ServiceContainer', () => {

    let container: Common.ServicecContainer;
    let loggingToken = { Token: 'ILoggingService' };
    let errortoken = { Token: 'IExceptionLoggingService' };
    let talkToken = { Token: 'ITalkService' };


    beforeEach(() => {
        container = new Common.ServicecContainer();

        container.Register(Common.ServiceDescriptor.Singleton(loggingToken).UseType(Common.LoggingService));
        container.Register(Common.ServiceDescriptor.Singleton(errortoken).UseType(Common.ExceptionLoggingService));
        container.Register(Common.ServiceDescriptor.Singleton(talkToken).UseType(Common.TalkService));

    });

    it('', () => {

    });
    it('Resolve service without dependency', () => {
        let service = container.GetService<Common.ILoggingService>(loggingToken);
        expect(service).to.not.be.equals(null);
        service.Debug('Debug message from test environment');
    });
    it('Resolve service with dependency', () => {
        let service = container.GetService<Common.IExceptionHandlingService>(errortoken);
        expect(service).to.not.be.equals(null);
        service.Handle('Exception handler');
    });
})