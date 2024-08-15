import { validateMiddleware } from '@core/middleware/validate.middleware';
import { ResponseBuilder } from '@core/utils/response-builder';
import Router from '@koa/router';
import { AppState } from '@models/app.state';
import { ParameterizedContext } from 'koa';
import Container from 'typedi';
import { Context } from 'vm';
import { EventService } from '@services/event/event.service';
import {
  ClaimTaskRequest,
  VerifyTaskRequest,
} from '@models/event/event.request';
import { GetUserInfo } from '@core/middleware/auth.middleware';
import { UserInfo } from '@models/authorzization/user.info';
import { plainToClass } from 'class-transformer';

const EventRoute = new Router({
  prefix: '/event',
});

// Get list
// Get list
EventRoute.get(
  '/task/process',
  GetUserInfo,
  validateMiddleware({
    query: ClaimTaskRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const eventService = Container.get<EventService>(EventService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const result = await eventService.getProcessTask(ctx.request.query, user);
    ctx.body = new ResponseBuilder(result).build();
  },
);

EventRoute.post(
  '/task/claim',
  GetUserInfo,
  validateMiddleware({
    body: ClaimTaskRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const eventService = Container.get<EventService>(EventService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const result = await eventService.claimTask(ctx.request.body, user);
    ctx.body = new ResponseBuilder(result).build();
  },
);

EventRoute.post(
  '/task/verify-task',
  GetUserInfo,
  validateMiddleware({
    body: VerifyTaskRequest,
  }),
  async (ctx: ParameterizedContext<AppState, Context>): Promise<void> => {
    const eventService = Container.get<EventService>(EventService);
    let user = ctx.state.user;
    user = user ? plainToClass(UserInfo, ctx.state.user) : null;
    const result = await eventService.verifyTask(ctx.request.body, user);
    ctx.body = new ResponseBuilder(result).build();
  },
);

export { EventRoute };
