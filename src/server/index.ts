import koa from 'koa';
import koaRouter from 'koa-router';
import userRouter from './api/UserRouter';

const app = new koa();
const router = new koaRouter();

// Default port to listen
const port = 8080;

// Define a route handler for the default home page
router.get('/', (ctx, next) => {
	ctx.body = 'Hello World!';
});

// Add the defined routes to the application
app.use(router.routes());
app.use(userRouter.routes());

// Begin listening on the defined port
const server = app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
