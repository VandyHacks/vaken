import koa from 'koa';
import koaBodyparser from 'koa-bodyparser';
import koaHelmet from 'koa-helmet'; // good default security config
import cors from '@koa/cors';
import api from './api';
import koaBunyanLogger from 'koa-bunyan-logger';
// import koaJwt from 'koa-jwt';

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

// logging (only if not during tests)
if (process.env.NODE_ENV !== 'test') {
  app.use(koaBunyanLogger());
  // @ts-ignore
  app.use(koaBunyanLogger.requestIdContext());
  // @ts-ignore
  app.use(koaBunyanLogger.requestLogger());
}

// body parser middleware
app.use(koaBodyparser()); // https://github.com/koajs/bodyparser

app.use(async (ctx, next) => {
  // the parsed body will store in ctx.ctx: Context, _: Promise<any>.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
  await next();
});

// JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
/*
const jwtConfig: koaJwt.Options = {
  secret: process.env.jwtSecret || '',
};
app.use(koaJwt(jwtConfig));*/

// add api
app.use(api.routes()).use(api.allowedMethods()); // makes sure a 405 Method Not Allowed is sent

// TODO: handle default route
// app.get('/', async (ctx: koa.Context) => {
//   // TODO: redirect to frontend...
//   console.log(ctx.state);
// });

// todo put in config
const PORT: Number = parseInt(process.env.PORT || '8000', 10);

// start server
// NOTE: doesn't do HTTPS default??
const server = app.listen(PORT, () =>
  console.log(`Server running on ${PORT}!`)
);

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

// export, mostly for testing purposes
export default server;
