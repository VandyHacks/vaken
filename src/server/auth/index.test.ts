import Express from 'express';
import { registerAuthRoutes } from './index';

const app = Express();
registerAuthRoutes(app);

describe('Test auth/index.ts', () => {
	describe('registerAuthRoutes', () => {
		it('registers /api/auth/google', async () => {
			expect(
				app._router.stack.some(
					(r: { route: Express.IRoute }) => r.route && r.route.path === '/api/auth/google'
				)
			).toBeTruthy();
		});

		it('registers /api/auth/google/callback', async () => {
			expect(
				app._router.stack.some(
					(r: { route: Express.IRoute }) => r.route && r.route.path === '/api/auth/google/callback'
				)
			).toBeTruthy();
		});

		it('registers /api/auth/github', async () => {
			expect(
				app._router.stack.some(
					(r: { route: Express.IRoute }) => r.route && r.route.path === '/api/auth/github'
				)
			).toBeTruthy();
		});

		it('registers /api/auth/github/callback', async () => {
			expect(
				app._router.stack.some(
					(r: { route: Express.IRoute }) => r.route && r.route.path === '/api/auth/github/callback'
				)
			).toBeTruthy();
		});

		it('registers /api/logout', async () => {
			expect(
				app._router.stack.some(
					(r: { route: Express.IRoute }) => r.route && r.route.path === '/api/logout'
				)
			).toBeTruthy();
		});
	});
});
