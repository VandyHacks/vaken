import koaRouter from 'koa-router';
import UserRouter from './users/UserRouter';
// import {Context} from 'koa';
// add event router
// add admin router
// add stats router
// etc...

const apiRouter = new koaRouter({
  prefix: '/api',
});

// poor man's route logging
apiRouter.use('/*', async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.status} ${ctx.originalUrl} `);
  await next();
});

// handy shortcut
// const get = apiRouter.get.bind(apiRouter);

apiRouter.use('/users', UserRouter.routes(), UserRouter.allowedMethods());

export default apiRouter;
