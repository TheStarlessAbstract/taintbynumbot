const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

const commands = require("./bot-commands");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const discordChannelId = process.env.DISCORD_CHANNEL;

client.commands = new Collection();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

async function setup() {
	const channel = client.channels.cache.get(discordChannelId);

	let twitchCommands = [];

	let messages = await channel.messages.fetch();

	if (messages.size > 0) {
		await updateCommands();
	} else {
		twitchCommands = createCommands();
		for (let i = 0; i < twitchCommands.length; i++) {
			channel.send({ content: twitchCommands[i] });
		}
	}
}

function createCommands() {
	let content = [];
	let contentLine;
	let contentComment = "";
	let chatCommands = commands.getCommands();

	if (chatCommands.length > 0) {
		for (let i = 0; i < chatCommands.length; i++) {
			contentLine = "";

			contentLine = "`!" + chatCommands[i].name + "`\n";

			for (let j = 0; j < chatCommands[i].versions.length; j++) {
				if (chatCommands[i].versions.length > 1) {
					contentLine += "__**Option: " + (j + 1) + "**__\n";
				}

				contentLine +=
					"*Description:* " +
					chatCommands[i].versions[j].description +
					"\n" +
					"*Usage:* " +
					chatCommands[i].versions[j].usage +
					"\n" +
					"*Usable by:* " +
					chatCommands[i].versions[j].usableBy +
					"\n";

				if (j == chatCommands[i].versions.length - 1) {
					contentLine += "=======\n";
				}
			}

			if (contentComment.length + contentLine.length > 2000) {
				contentComment = contentComment.slice(0, -1);
				content.push(contentComment);
				contentComment = "";
			}
			contentComment += contentLine;
		}

		if (contentComment.length > 0) {
			contentComment = contentComment.slice(0, -1);
			content.push(contentComment);
		}
	}

	return content;
}

async function updateCommands(action, updateCommand) {
	const channel = client.channels.cache.get(discordChannelId);
	let twitchCommands = [];
	let contentLine = "";

	let messages = await channel.messages.fetch();
	let newMessages = [];
	twitchCommands = createCommands();

	if (action == "add" || action == "edit" || action == "delete") {
		contentLine = "**This command has been ";

		if (action == "add") {
			contentLine += "created** \n";
		} else if (action == "edit") {
			contentLine += "edited** \n";
		} else if (action == "delete") {
			contentLine += "deleted** \n";
		}

		contentLine +=
			"`!" +
			updateCommand.name +
			"`\n" +
			"*Description:* " +
			updateCommand.description +
			"\n" +
			"*Usage:* " +
			updateCommand.usage +
			"\n" +
			"*Usable by:* " +
			updateCommand.usableBy +
			"\n";

		twitchCommands.push(contentLine);
	}

	for (const [key, value] of messages) {
		newMessages.push(value);
	}

	newMessages.reverse();

	if (newMessages.length > twitchCommands.length) {
		for (let i = twitchCommands.length; i < newMessages.length; i++) {
			await newMessages[i].delete();
		}

		newMessages.splice(
			twitchCommands.length,
			newMessages.length - twitchCommands.length
		);
	} else if (newMessages.length < twitchCommands.length) {
		for (let i = newMessages.length; i < twitchCommands.length; i++) {
			await channel.send({ content: twitchCommands[i] });
		}
	}

	for (let i = 0; i < newMessages.length; i++) {
		if (newMessages[i].content !== twitchCommands[i]) {
			await channel.messages.edit(newMessages[i], twitchCommands[i]);
		}
	}
}

exports.setup = setup;
exports.updateCommands = updateCommands;
