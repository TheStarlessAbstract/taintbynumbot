const ApiClient = require("@twurple/api").ApiClient;
const ChatClient = require("@twurple/chat").ChatClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const { find, findOne } = require("./../queries/users");
const twitchController = require("../controllers/twitch");
const channelsService = require("../services/channels/channels");
const channelService = require("../services/channel/channel");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

let apiClient;
let chatClient;
let pubSubClient;

async function init() {
	const users = await find(
		{ "tokens.twitch": { $exists: true } },
		"channelId displayName messages messageCountTrigger messageIntervalLength customBot role tokens.twitch"
	);

	if (users.length === 0) return;

	const authProvider = await createAuthProvider();
	let token;

	for (let i = 0; i < users.length; i++) {
		token = tokenFormat(users[i].tokens.get("twitch"));

		let intent = [`chat`];
		if (users[i].role != "bot") {
			const channel = await channelService.createChannel(
				users[i].channelId,
				users[i].displayName,
				users[i].messages,
				users[i].messageCountTrigger,
				users[i].messageIntervalLength,
				users[i].customBot
			);

			const res = await channelsService.addChannel(channel.id, channel);
			if (!res) continue;
			intent = [`pubsub:${channel.channelId}`];
		}

		authProvider.addUser(users[i].channelId, token, intent);
	}

	apiClient = createApiClient(authProvider);
	chatClient = await createChatClient(authProvider);
	pubSubClient = createPubSubClient(authProvider);

	twitchController.init();

	return true;
}

async function createAuthProvider() {
	let authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
	});

	authProvider.onRefresh(async (channelId, token) => {
		await updateUserTwitchToken(channelId, token);
	});

	return authProvider;
}

async function updateUserTwitchToken(channelId, token) {
	const user = await findOne(
		{
			channelId,
		},
		"tokens.twitch"
	);
	if (!user) return;

	user.tokens.set("twitch", tokenFormat(token));
	user.save();
}

function tokenFormat(token) {
	return {
		tokenType: "twitch",
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		scope: token.scope,
		expiresIn: token.expiresIn,
		obtainmentTimestamp: token.obtainmentTimestamp,
	};
}

function createApiClient(authProvider) {
	return new ApiClient({
		authProvider,
		// logger: {
		// 	minLevel: "debug",
		// },
	});
}

async function createChatClient(authProvider) {
	return new ChatClient({
		authProvider,
		channels: await getUsernames(),
		requestMembershipEvents: true,
		isAlwaysMod: true,
	});
}

function createPubSubClient(authProvider) {
	return new PubSubClient({ authProvider });
}

async function getUsernames() {
	const usersFromDb = await find({ role: { $ne: "bot" } }, "displayName");
	const displayNames = usersFromDb.map((user) => user.displayName);

	return displayNames;
}

function getApiClient() {
	return apiClient;
}

function getChatClient() {
	return chatClient;
}

function getPubSubClient() {
	return pubSubClient;
}

exports.init = init;
exports.getApiClient = getApiClient;
exports.getChatClient = getChatClient;
exports.getPubSubClient = getPubSubClient;
