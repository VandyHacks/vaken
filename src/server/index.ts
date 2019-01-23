import koa from "koa";
import koaRouter from "koa-router";

const app = new koa();
const router = new koaRouter();

const port = 8080; // default port to listen

// define a route handler for the default home page
router.get( "/", (ctx, next) => {
    ctx.body = "Hello World!";
} );

app.use(router.routes());

const server = app.listen(port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
