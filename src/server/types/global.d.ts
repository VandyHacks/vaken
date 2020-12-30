export {};

declare global {
	namespace Express {
		interface SessionData {
			cookie: any;
		}
	}
}
