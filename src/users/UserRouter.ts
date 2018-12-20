import koaRouter from 'koa-router';
import { Context } from 'koa';
import UserController from './UserController';

const USER = new UserController();

const USER_ROUTER = new koaRouter();

USER_ROUTER.post('create', async (ctx: Context) => {
  const newUser = ctx.params;
  /*
  check(newUser.name)
  .isString()
  .isAlpha()
  .isLength({ min: 1, max: 60 });
check(newUser.password)
  .isString()
  .isAlphanumeric()
  .isLength({ min: 1, max: 60 });*/

  await USER.user_create(newUser);

  ctx.body = '';
})
  .post('delete', async (ctx: Context) => {
    ctx.body = '';
  })
  .post('update', async (ctx: Context) => {
    ctx.body = '';
  })
  .get('list', async (ctx: Context) => {
    ctx.body = '';
  })
  .get(':id', async (ctx: Context) => {
    ctx.body = '';
  });

export default USER_ROUTER;
