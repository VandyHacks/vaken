import koaJoiRouter from 'koa-joi-router';
import { Context } from 'koa';
import UserController from '../controllers/UserController';

const USER = new UserController();

// const apiRouter = koaJoiRouter();

const router = koaJoiRouter(); // comes with body parser + Joi validation

router.prefix('/user');
router.post('create', async (ctx: Context) => {
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
});
router.post('delete', async (ctx: Context) => {
  ctx.body = '';
});
router.post('update', async (ctx: Context) => {
  ctx.body = '';
});
router.get('list', async (ctx: Context) => {
  ctx.body = '';
});
router.get(':id', async (ctx: Context) => {
  ctx.body = '';
});

// router.prefix('/event')
// event routes

// router.prefix('/admin')
// admin routes?

// temp route
router.get('/', async (ctx: Context) => {
  ctx.body = 'hello world';
});

// apiRouter.use(router.routes); // nesting routers

export default router;
