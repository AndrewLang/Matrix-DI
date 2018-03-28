import * as Common from './imports';
import 'mocha';
import { expect } from 'chai';


describe('AppBuilder', () => {
    let loggingName = 'default-logging';;
    let errorName = 'default-error-handling';

    let container: Common.ServiceContainer;
    let loggingToken = { Token: 'ILoggingService' };
    let errortoken = { Token: 'IExceptionLoggingService' };
    let talkToken = { Token: 'ITalkService' };
    let transientToken = { Token: 'ITransient' };
    let transientClientToken = { Token: 'ITransientClient' };
    let appBuilderToken = { Token: 'IAppBuilder' };

    beforeEach(() => {
        container = new Common.ServiceContainer();

        container.Singleton(loggingToken).UseType(Common.LoggingService).WithName(loggingName);
        container.Singleton(errortoken).UseType(Common.ExceptionLoggingService).WithName(errorName);
        container.Singleton(talkToken).UseType(Common.TalkService);
        container.Singleton(transientClientToken).UseType(Common.TransientClient);

        container.Singleton(appBuilderToken).UseType(Common.AppBuilder);

        container.Transient(transientToken).UseType(Common.Transient);
    });

    it('', () => {

    });

    it('Get Default AppBuilder', () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        expect(appBuilder).to.not.be.equals(null);
    });

    it('ServiceContainer is valid', () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        expect(appBuilder).to.not.be.equals(null);
        expect(appBuilder.ServiceContainer).to.not.be.equals(null);
    });
    it('Properties is valid', () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        expect(appBuilder.Properties).to.not.be.equals(null);
    });
    it('Use component', () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        let component: Common.IComponent = {
            ConfigureServices: (services: Common.IServiceContainer) => { },
            Configure: () => { }
        };

        appBuilder.Use(component);

        expect(appBuilder.Components).to.not.be.equals(null);
        expect(appBuilder.Components.length).equals(1);
    });

    it('Build', () => {
        let serviceConfigured = false;
        let configured = false;

        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        let component: Common.IComponent = {
            ConfigureServices: (services: Common.IServiceContainer) => { serviceConfigured = true; },
            Configure: () => { configured = true; }
        };

        appBuilder.Use(component).Build();


        expect(serviceConfigured).equals(true);
        expect(configured).equals(true);
    });

});
