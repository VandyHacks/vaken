import koaRouter from 'koa-router';
// import { Context } from 'koa';
import UserController from './UserController';
// import { join } from 'path';

const USER = new UserController();

const USER_ROUTER = new koaRouter();
console.log('Im a router');

USER_ROUTER.post('create', async (ctx, next) => {
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
  await next();
})
  .post('/delete', async (ctx, next) => {
    ctx.body = 'c';
    await next();
  })
  .post('/update', async (ctx, next) => {
    ctx.body = 'b';
    await next();
  })
  .get('/list', async (ctx, next) => {
    ctx.body = 'a';
    await next();
  })
  .get('/:id', async (ctx, next) => {
    ctx.body = 'foo';
    console.log('I wanna die');
    await next();
  });

export default USER_ROUTER;
