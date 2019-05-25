// mock browser fetch

// NOTE: can't use async b/c babel transform only applies to test files, not setup files
global.fetch = () =>
	new Promise(() => ({
		json: () => {
			message: 'ok';
		},
		status: 200,
	}));
