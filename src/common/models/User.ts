export class User {
	public email: string = '';

	public password: string = '';

	public firstName?: string;

	public lastName?: string;

	public google?: string;

	public github?: string;

	public authType: string = 'None';

	public authLevel: string = 'Hacker';

	public phoneNumber?: string;

	public gender?: string;

	public shirtSize?: string;

	public dietaryRestrictions?: string;
}
