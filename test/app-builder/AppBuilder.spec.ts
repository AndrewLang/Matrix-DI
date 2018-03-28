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

    it('ServiceProvider is valid', () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        expect(appBuilder).to.not.be.equals(null);
        expect(appBuilder.ServiceProvider).to.not.be.equals(null);
    });
    it('Properties is valid', () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        expect(appBuilder.Properties).to.not.be.equals(null);
    });
    it('UseBlock Build', async () => {
        let appBuilder = container.Resolve<Common.IAppBuilder>(appBuilderToken);
        let middleware1: Common.DelegateBlock = async (context, next) => {
            context.Tag++; context.Properties.Add('Middleware1', true);
            if (next) {
                await next(context);
            }
        };
        let middleware2: Common.DelegateBlock = async (context, next) => {
            context.Tag++; context.Properties.Add('Middleware2', true);
            if (next) {
                await next(context);
            }
        };

        appBuilder
            .Use(middleware1)
            .Use(middleware2);

        let context = { Tag: 1, Properties: new Common.Dictionary<any, any>() };
        let entry = appBuilder.Build();

        await entry.Block(context);

        expect(context.Tag).be.equals(3);
        expect(context.Properties.Item('Block1')).be.equals(true);
        expect(context.Properties.Item('Block2')).be.equals(true);
    });


});
