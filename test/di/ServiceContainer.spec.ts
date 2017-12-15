import * as Common from './imports';
import 'mocha';
import { expect } from 'chai';


describe('ServiceContainer', () => {

    let loggingName = 'default-logging';;
    let errorName = 'default-error-handling';

    let container: Common.ServicecContainer;
    let loggingToken = { Token: 'ILoggingService' };
    let errortoken = { Token: 'IExceptionLoggingService' };
    let talkToken = { Token: 'ITalkService' };
    let transientToken = { Token: 'ITransient' };
    let transientClientToken = { Token: 'ITransientClient' };

    beforeEach(() => {
        container = new Common.ServicecContainer();

        container.Register(Common.ServiceDescriptor.Singleton(loggingToken).UseType(Common.LoggingService).WithName(loggingName));
        container.Register(Common.ServiceDescriptor.Singleton(errortoken).UseType(Common.ExceptionLoggingService).WithName(errorName));
        container.Register(Common.ServiceDescriptor.Singleton(talkToken).UseType(Common.TalkService));
        //container.Register(Common.ServiceDescriptor.Singleton(transientClientToken).UseType(Common.TransientClient));

        container.Singleton(transientClientToken).UseType(Common.TransientClient);

        //container.Register(Common.ServiceDescriptor.Transient(transientToken).UseType(Common.Transient));
        container.Transient(transientToken).UseType(Common.Transient);
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

    it('Transient should return different instance', () => {
        let client = container.GetService<Common.ITransient>(transientToken);
        let date1 = client.GetId();

        client = container.GetService<Common.ITransient>(transientToken);
        let date2 = client.GetId();

        console.log(`${date1}  ${date2}`);
        expect(date1).to.not.be.equals(date2, `${date1} == ${date2}`);
    });

    it('Resolve service by name', () => {

        let loggingSvc = container.ResolveByName<Common.ILoggingService>(loggingName);
        expect(loggingSvc).to.not.be.equals(null);

        let errprSvc = container.ResolveByName<Common.IExceptionHandlingService>(errorName);
        expect(errprSvc).to.not.be.equals(null);
    });

})