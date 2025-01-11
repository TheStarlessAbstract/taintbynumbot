const discord = require("../../repos/discord");
const Events = require("events");
const channelsService = require("../channels/channels");
const { find: commandsFind } = require("../../queries/commands");

async function init() {
	const loginEvent = new Events.EventEmitter();
	loginEvent.once("login", loginEventHandler);
	await discord.login(loginEvent);
}

const loginEventHandler = async function () {
	const client = discord.getClient();

	const twitchChannels = channelsService.getChannelsWithProperty(
		"discordCommandsChannelId"
	);

	for (let i = 0; i < twitchChannels.length; i++) {
		if (!client.channels.cache.has(twitchChannels[i].discordCommandsChannelId))
			continue;

		const discordChannel = client.channels.cache.get(
			twitchChannels[i].discordCommandsChannelId
		);

		await commandsChannelInit(twitchChannels[i], discordChannel);
	}
};

async function commandsChannelInit(twitchChannel, discordChannel) {
	const [messages, commands] = await Promise.all([
		discordChannel.messages.fetch(),
		commandsFind({ channelId: twitchChannel.id }),
	]);

	if (commands.length === 0) return;

	const content = generateCommandComments(commands);

	if (messages.size === 0) {
		for (let i = 0; i < content.length; i++) {
			discordChannel.send({ content: content[i] });
		}
	}
}

function generateCommandComments(commands) {
	const content = [];
	let contentComment = "";

	for (let i = 0; i < commands.length; i++) {
		let contentLine = `\`!${commands[i].chatName}\n\``;
		contentLine += commandVersionLine(commands[i]);
		contentLine += `=======\n`;

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

	return content;
}

function commandVersionLine(command) {
	let contentLine = "";
	let versionCounter = 1;

	command.versions.forEach((value, key, map) => {
		if (map.size > 1) {
			contentLine += `__**Option: ${versionCounter}**__\n`;
			versionCounter++;
		}

		// contentLine += `*Description: *${value.description}\n
		// *Usage:* ${value.usage} \n
		// *Usable by:* ${value.usableBy}\n`;
		contentLine += `*Description:* ${value.description}\n*Usable by:* ${value.usableBy}\n`;
	});

	return contentLine;
}

exports.init = init;
