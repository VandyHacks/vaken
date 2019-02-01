import koa from 'koa';
import koaRouter from 'koa-router';
import userRouter from './api/UserRouter';
import mongoose from 'mongoose';
import { userModel } from './models/User';

const app = new koa();
const router = new koaRouter();

// Default port to listen
const port = 8080;

// Define a route handler for the default home page
router.get('/', (ctx, next) => {
	ctx.body = 'Hello World!';
});

// Mongo test
router.post('/mongo', async (ctx, next) => {
	const newUser = new userModel(ctx.request.query);
	await newUser.save();
	const user = await userModel.findOne({ firstName: 'vandy' });
	console.log(user);
});

// Add the defined routes to the application
app.use(router.routes());
app.use(userRouter.routes());

mongoose.connect('mongodb://localhost:27017/test').then(
	() => {
		console.log('>>> MongoDB Connected');
	},
	err => {
		console.log(err);
	}
);

// Begin listening on the defined port
const server = app.listen(port, () => {
	console.log(`>>> Server started at http://localhost:${port}`);
});
