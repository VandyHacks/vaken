import koa from 'koa';

import koaHelmet from 'koa-helmet'; // good default security config
import cors from '@koa/cors';
import router from './router';
import koaJwt from 'koa-jwt';

// todo: put in config file
/*
const whitelist = ['vandyhacks.org'];
const corsOptions: cors.Options = {
  origin: async (ctx: Context) => {
    if (whitelist.indexOf(ctx.url) !== -1) {
      return true;
    } else {
      return 'Not allowed by CORS';
    }
  },
};*/

// create server
const app = new koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 400;
    ctx.body = `Uh-oh: ${err.message}`;
    console.log('Error handler:', err.message);
  }
});

app.use(koaHelmet());

// can also put over individual routes, with cors-preflight
// app.use(cors(corsOptions));
app.use(cors());

// NOTE: koa body parser included in koa-joi-router, don't include separate to prevent type decl. conflict
// app.use(koaBodyparser()); // https://github.com/koajs/bodyparser

app.use(async ctx => {
  // the parsed body will store in ctx.ctx: Context, _: Promise<any>.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});

// JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
const jwtConfig: koaJwt.Options = {
  secret: process.env.jwtSecret || '',
};
app.use(koaJwt(jwtConfig));

app.use(router.middleware());
// TODO: makes sure a 405 Method Not Allowed is sent

// todo put in config
const PORT: Number = parseInt(process.env.PORT || '8000', 10);

// start server
// NOTE: doesn't do HTTPS default??
app.listen(PORT, () => console.log(`Server running on ${PORT}!`));

/**
 *
 * Handle unhandled rejections and uncaught exceptions
 *
 * Should never happen if good error handling is in place, is just a fallback
 *
 */
// catch unhandled rejections
process.on('unhandledRejection', (reason: Error, _: Promise<any>) => {
  // just convert to error, let uncaughtException handle it
  throw reason;
});
process.on('uncaughtException', error => {
  // TODO: should handle error here...
  console.log('UNCAUGHT EXCEPTION: ', error);
  // process.exit(1);
});
