const Helper = require("./classes/helper");

const commands = require("./bot-commands");
const deathCounter = require("./bot-deathcounter");
const messages = require("./bot-messages");
const loyalty = require("./bot-loyalty");
const twitchRepo = require("./repos/twitch");
const twitchService = require("./services/twitch");
const kings = require("./commands/kings");

let botUsername = process.env.TWITCH_BOT_USERNAME;
let userId = process.env.TWITCH_USER_ID;
let username = process.env.TWITCH_USERNAME;

const helper = new Helper();

let apiClient;
let chatClient;
let isLive = false;
let intervalMessages;
let messageCount = 0;
let timedMessagesInterval;
let issuesRaised;

async function init() {
	apiClient = twitchRepo.getApiClient();
	chatClient = twitchRepo.getChatClient();

	if (!helper.isTest()) {
		chatClient.connect();
		await setupChatClientListeners();
	}
}

async function setupChatClientListeners() {
	chatClient.onAuthenticationSuccess(async () => {
		connected();
		checkLive();

		if (!helper.isTest()) {
			kings.resetKings();
			await commands.setup();
			await deathCounter.setup(apiClient);
		}
	});

	await chatClient.onMessage(async (channel, user, message, msg) => {
		messageCount++;

		if (shouldIgnoreMessage(user, botUsername, message)) return;

		if (!userInfoCheck(msg.userInfo)) {
			const userInfo = msg.userInfo;
			let [command, argument] = message.slice(1).split(/\s(.+)/);
			let commandLink = commands.list[command.toLowerCase()];

			if (commandLink == undefined) return;

			const { response } = (await commandLink.getCommand()) || {};
			let versions = commandLink.getVersions();
			let hasActiveVersions =
				versions.filter(function (version) {
					return version.active;
				}).length > 0;
			if (hasActiveVersions) {
				if (typeof response === "function") {
					let result = await response({
						channelId: msg.channelId,
						userInfo,
						argument,
					});

					if (result) {
						for (let i = 0; i < result.length; i++) {
							chatClient.say(channel, result[i]);
						}
					}
				} else if (typeof response === "string") {
					chatClient.say(channel, response);
				}
			}
		} else {
			console.log("userInfo types changed");
		}
	});
}

async function connected() {
	if (!helper.isTest()) {
		console.log(" * Connected to Twitch chat * ");
	}
}

async function checkLive() {
	setInterval(async () => {
		let streamLiveFlag = await isStreamLive();

		if (streamLiveFlag && !isLive) {
			setTimedMessages();
			if (process.env.JEST_WORKER_ID == undefined) {
				loyalty.start();
			}
			isLive = true;
		} else if (!streamLiveFlag && isLive) {
			clearInterval(timedMessagesInterval);
			loyalty.stop();
			isLive = false;
		}
	}, 5 * 60 * 1000);
}

async function isStreamLive() {
	let streamStatus;

	try {
		let stream = await twitchService.getStreamByUserId(userId);

		if (stream == null) {
			streamStatus = false;
		} else {
			streamStatus = true;
		}
	} catch {
		streamStatus = false;
	}

	return streamStatus;
}

async function setTimedMessages() {
	intervalMessages = await messages.get();

	timedMessagesInterval = setInterval(async () => {
		if (messageCount >= 25) {
			const [message] = intervalMessages.splice(
				helper.getRandomBetweenExclusiveMax(0, intervalMessages.length),
				1
			);

			chatClient.say(`#${username}`, `${message.index}. ${message.text}`);
			messageCount = 0;

			if (intervalMessages.length == 0) {
				intervalMessages = await messages.get();
			}
		}
	}, 10 * 60 * 1000);
}

function shouldIgnoreMessage(user, botUsername, message) {
	return (
		user === botUsername || user === "buhhsbot" || !message.startsWith("!")
	);
}

function messageUpdate(update) {
	intervalMessages = update;
}

function userInfoCheck(userInfo) {
	const stringTypes = [
		userInfo.color,
		userInfo.displayName,
		userInfo.userId,
		userInfo.userName,
		userInfo.userType,
	];

	const stringUndefinedTypes = [userInfo.color, userInfo.userType];

	const boolTypes = [
		userInfo.isArtist,
		userInfo.isBroadcaster,
		userInfo.isFounder,
		userInfo.isMod,
		userInfo.isSubscriber,
		userInfo.isVip,
	];
	const mappedTypes = [userInfo.badgeInfo, userInfo.badges];

	issuesRaised = false;

	stringTypes.forEach(confirmStrings);

	if (!issuesRaised) {
		stringUndefinedTypes.forEach(confirmStringsOrUndefined);
	}

	if (!issuesRaised) {
		boolTypes.forEach(confirmBools);
	}

	if (!issuesRaised) {
		mappedTypes.forEach(confirmMaps);
	}

	return issuesRaised;
}

function confirmStrings(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "string";
	}
}

function confirmStringsOrUndefined(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "string" || item == undefined;
	}
}

function confirmBools(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "boolean";
	}
}

function confirmMaps(item) {
	if (!issuesRaised) {
		issuesRaised = !(item instanceof Map);
	}
}

exports.init = init;
exports.messageUpdate = messageUpdate;
