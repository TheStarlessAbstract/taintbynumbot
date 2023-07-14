const ApiClient = require("@twurple/api").ApiClient;
const ChatClient = require("@twurple/chat").ChatClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;
const Helper = require("./classes/helper");

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

const helper = new Helper();

let apiClient;
let isLive = false;
let intervalMessages;
let messageCount = 0;
let timedMessagesInterval;
let token;
let issuesRaised;

async function setup() {
	token = await Token.findOne({ name: "chatClient" });

	if (token) {
		const tokenData = initializeTokenData(token);
		const authProvider = await createAuthProvider(tokenData);
		const chatClient = createChatClient(authProvider);
		const apiClient = new ApiClient({ authProvider });

		setApiClient(apiClient);

		if (!helper.isTest()) {
			await chatClient.connect(chatClient);
			await setupChatClientListeners(apiClient, chatClient);
		}
	}
}

async function connected() {
	if (!helper.isTest()) {
		console.log(" * Connected to Twitch chat * ");
	}
}

async function setupChatClientListeners(apiClient, chatClient) {
	chatClient.onAuthenticationSuccess(async () => {
		connected();

		checkLive(apiClient, chatClient);

		if (!helper.isTest()) {
			kings.resetKings();
			redemptions.setChatClient(chatClient);
			await commands.setup();
			await deathCounter.setup(apiClient);
		}
	});

	await chatClient.onMessage(async (channel, user, message, msg) => {
		messageCount++;

		if (shouldIgnoreMessage(user, botUsername, message)) return;

		// const userInfo = msg.userInfo;

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

async function setTimedMessages(chatClient) {
	intervalMessages = await messages.get();

	timedMessagesInterval = setInterval(async () => {
		if (messageCount >= 25) {
			const [message] = intervalMessages.splice(
				getRandomBetween(0, intervalMessages.length),
				1
			);

			chatClient.say("#" + username, message.index + ". " + message.text);

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

async function createAuthProvider(tokenData) {
	let authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
		onRefresh: async (userId, newTokenData) => {
			if (process.env.JEST_WORKER_ID == undefined) {
				token.accessToken = newTokenData.accessToken;
				token.refreshToken = newTokenData.refreshToken;
				token.scope = newTokenData.scope;
				token.expiresIn = newTokenData.expiresIn;
				token.obtainmentTimestamp = newTokenData.obtainmentTimestamp;

				await token.save();
			}
		},
	});

	await authProvider.addUserForToken(tokenData, ["chat"]);

	return authProvider;
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

async function getApiClient() {
	if (!apiClient) {
		await setup();
	}
	return apiClient;
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

exports.setup = setup;
exports.messageUpdate = messageUpdate;
exports.getApiClient = getApiClient;
