import Discord from 'discord.js';

const client = new Discord.Client();

client.on('ready', () => {
	if (client.user) console.log(`Logged in as ${client.user.tag}!`);
});

// client.on('message', async (msg: any) => {
// }

export async function sendMessageToRole(roleName: string, message: string): Promise<void> {
	console.log('HERE');
	const guild = client.guilds.cache.entries().next().value[1];
	const members = await guild.members.fetch();
	const roles = await guild.roles.fetch();
	let roleId = '';

	return new Promise(resolve => {
		roles.cache.forEach((role: any) => {
			if (role.name === roleName) {
				roleId = role.id;
			}
		});

		members.forEach((member: any) => {
			if (member._roles.includes(roleId)) {
				member.user.send(message);
			}
		});
		resolve();
	});
}

client.login('NDczNDkzMDI1NTQ1Mzg4MDQy.XxeiNg.7KuxQp_Dlm0pcACVyP_fUPKu6-Q');
