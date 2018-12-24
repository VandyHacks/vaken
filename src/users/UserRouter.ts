import koaRouter from 'koa-router';
// import { Context } from 'koa';
import UserController from './UserController';
// import { join } from 'path';

const USER = new UserController();

const USER_ROUTER = new koaRouter();
console.log('Im a router');

USER_ROUTER.post('create', async ctx => {
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
  .post('/delete', async ctx => {
    ctx.body = 'c';
  })
  .post('/update', async ctx => {
    ctx.body = 'b';
  })
  .get('/list', async ctx => {
    ctx.body = {
      users: [
        {
          name: 'a',
        },
        {
          name: 'b',
        },
      ],
    };
  })
  .get('/:id(\\d+)', async ctx => {
    // only matches numerical IDs

    ctx.body = {
      name: 'none',
    };
  });

export default USER_ROUTER;
