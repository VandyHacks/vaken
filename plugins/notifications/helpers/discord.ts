import Discord from 'discord.js';

const { DISCORD_TOKEN } = process.env;
const serverId = '755112297772351499';

const client = new Discord.Client();

client.on('ready', () => {
	if (client.user) console.log(`Logged in as ${client.user.tag}!`);
});

export async function sendMessageToRole(roleNames: string, message: string): Promise<void> {
	const guild = await client.guilds.cache.get(serverId);
	if (guild) {
		const members = await guild.members.fetch();
		const roles = await guild.roles.fetch();
		const roleIds = new Set();
		const roleNamesArr = roleNames.split(',');
		return new Promise(resolve => {
			roles.cache.forEach((role: Discord.Role) => {
				if (roleNamesArr.includes(role.name)) {
					roleIds.add(role.id);
				}
			});

			members.forEach((member: Discord.GuildMember) => {
				if (member.roles.cache.keyArray().filter(r => roleIds.has(r)).length > 0) {
					member.user.send(message);
				}
			});
			resolve();
		});
	}
	throw new Error('Server not found');
}

client.login(DISCORD_TOKEN);
