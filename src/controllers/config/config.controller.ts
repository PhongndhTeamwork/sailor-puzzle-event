import { validateMiddleware } from '@core/middleware/validate.middleware';
import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { ConfigBodyRequest, ConfigRequest } from '@models/map/map.request';
import { AppState } from '@models/app.state';
import { ParameterizedContext } from 'koa';
import Container from 'typedi';
import { Context } from 'vm';
import { ConfigService } from '@services/config/config.service';

const ConfigRoute = new Router({
  prefix: '/config',
});

// Get list
ConfigRoute.get(
  '/get',
  validateMiddleware({
    query: ConfigRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.getConfig(ctx.request.query);
    ctx.body = new ResponseBuilder(result).build();
  },
);

ConfigRoute.post(
  '/set',
  validateMiddleware({
    body: ConfigBodyRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.updateConfig(ctx.request.body);
    ctx.body = new ResponseBuilder(result).build();
  },
);

ConfigRoute.get(
  '/event-init',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.eventInit();
    ctx.body = new ResponseBuilder(result).build();
  },
);

ConfigRoute.get(
  '/event-daily-config',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.getEventDailyConfig();
    ctx.body = new ResponseBuilder(result).build();
  },
);

ConfigRoute.get(
  '/event-referral-config',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.getEventReferralConfig();
    ctx.body = new ResponseBuilder(result).build();
  },
);

ConfigRoute.get(
  '/dojo-config',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.getDojoConfig(ctx.request.query);
    ctx.body = new ResponseBuilder(result).build();
  },
);

ConfigRoute.post(
  '/update-config',
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const configService = Container.get<ConfigService>(ConfigService);
    const result = await configService.updateConfigAdmin(ctx.request.body);
    ctx.body = new ResponseBuilder(result).build();
  },
);

export { ConfigRoute };
