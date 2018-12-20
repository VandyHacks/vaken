import koaRouter from 'koa-router';
import UserRouter from './users/UserRouter';
// add event router
// add admin router
// add stats router
// etc...

const apiRouter = new koaRouter({
  prefix: '/api',
});
// handy shortcut
// const get = apiRouter.get.bind(apiRouter);

apiRouter.use('/users', UserRouter.routes(), UserRouter.allowedMethods());

export default apiRouter;
