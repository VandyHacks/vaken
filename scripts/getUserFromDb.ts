// TODO: make this a thing in ./scripts
// export async function getUserFromDb(email: string, userType?: string): Promise<UserDbInterface> {
// 	const { Hackers, Organizers, Sponsors } = await new DB().collections;

// 	let user: UserDbInterface | null = null;
// 	switch (userType) {
// 		case UserType.Hacker:
// 			user = await Hackers.findOne({ email });
// 			break;
// 		case UserType.Organizer:
// 			user = await Organizers.findOne({ email });
// 			break;
// 		case UserType.Sponsor:
// 			user = await Sponsors.findOne({ email });
// 			break;
// 		default:
// 			throw new Error(`invalid userType '${userType}'`);
// 	}

// 	if (!user) {
// 		throw new Error(`couldn't find user (${user}) with email ${email}`);
// 	}

// 	return user;
// }

console.error(
	'This script has not been implemented. Mostly working, commented out code is in the file.'
);
