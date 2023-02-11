const ApiClient = require("@twurple/api").ApiClient;
const ChatClient = require("@twurple/chat").ChatClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const commands = require("./bot-commands");
const deathCounter = require("./bot-deathcounter");
const messages = require("./bot-messages");
const redemptions = require("./bot-redemptions");
const loyalty = require("./bot-loyalty");

const kings = require("./commands/kings");

let botUsername = process.env.TWITCH_BOT_USERNAME;
let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;
let userId = process.env.TWITCH_USER_ID;
let username = process.env.TWITCH_USERNAME;

let apiClient;
let isLive = false;
let intervalMessages;
let messageCount = 0;
let timedMessagesInterval;
let token;

async function setup() {
	token = await Token.findOne({ name: "chatClient" });
	if (token) {
		const tokenData = initializeTokenData(token);
		const authProvider = createAuthProvider(tokenData);
		const chatClient = createChatClient(authProvider);
		const apiClient = new ApiClient({ authProvider });
		await chatClient.connect(chatClient);
		setupChatClientListeners(apiClient, chatClient);
	}
	await messages.setup();
}

async function connected() {
	console.log(" * Connected to Twitch chat * ");
}

async function setupChatClientListeners(apiClient, chatClient) {
	chatClient.onRegister(async () => {
		connected();
		checkLive(apiClient, chatClient);
		setApiClient(apiClient);

		kings.resetKings();
		redemptions.setChatClient(chatClient);
		await commands.setup();
		await deathCounter.setup(apiClient);
	});

	await chatClient.onMessage(async (channel, user, message, msg) => {
		messageCount++;

		if (shouldIgnoreMessage(user, botUsername, message)) return;

		const userInfo = msg.userInfo;
		const { isBroadcaster, isMod, isVip, isSub } = userInfo;
		const isModUp = isBroadcaster || isMod;

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
					isBroadcaster,
					isModUp,
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
	});
}

function shouldIgnoreMessage(user, botUsername, message) {
	return (
		user === botUsername || user === "buhhsbot" || !message.startsWith("!")
	);
}

async function checkLive(apiClient, chatClient) {
	setInterval(async () => {
		let streamLiveFlag = await isStreamLive(apiClient);

		if (streamLiveFlag && !isLive) {
			setTimedMessages(chatClient);
			isLive = true;
		} else if (!streamLiveFlag && isLive) {
			clearInterval(timedMessagesInterval);
			loyalty.stop();
			isLive = false;
		}
	}, 5 * 60 * 1000);
}

async function setTimedMessages(chatClient) {
	intervalMessages = await messages.get();

	timedMessagesInterval = setInterval(async () => {
		if (messageCount >= 25) {
			const [message] = intervalMessages.splice(
				getRandomBetween(0, intervalMessages.length),
				1
			);

			chatClient.say("#" + username, message.text);

			messageCount = 0;

			if (intervalMessages.length == 0) {
				intervalMessages = await messages.get();
			}
		}
	}, 10 * 60 * 1000);
}

function getRandomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function messageUpdate(update) {
	intervalMessages = update;
}

function initializeTokenData(token) {
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		scope: token.scope,
		expiresIn: 0,
		obtainmentTimestamp: 0,
	};
}

function createAuthProvider(tokenData) {
	return new RefreshingAuthProvider(
		{
			clientId,
			clientSecret,
			onRefresh: async (newTokenData) => {
				token.accessToken = newTokenData.accessToken;
				token.refreshToken = newTokenData.refreshToken;
				token.scope = newTokenData.scope;
				token.expiresIn = newTokenData.expiresIn;
				token.obtainmentTimestamp = newTokenData.obtainmentTimestamp;

				await token.save();
			},
		},
		tokenData
	);
}

function createChatClient(authProvider) {
	return new ChatClient({
		authProvider,
		channels: [username],
		requestMembershipEvents: true,
	});
}

async function isStreamLive(apiClient) {
	let streamStatus;

	try {
		let stream = await apiClient.streams.getStreamByUserId(userId);

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

function setApiClient(newApiClient) {
	apiClient = newApiClient;
}

function getApiClient() {
	return apiClient;
}

exports.setup = setup;
exports.messageUpdate = messageUpdate;
exports.getApiClient = getApiClient;
