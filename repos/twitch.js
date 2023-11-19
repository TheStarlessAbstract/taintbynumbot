const ApiClient = require("@twurple/api").ApiClient;
const ChatClient = require("@twurple/chat").ChatClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;
const Helper = require("./../classes/helper");

const User = require("./../models/user");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const helper = new Helper();

let apiClient;
let chatClient;
let pubSubClient;

async function init() {
	let users = await User.find({}, "twitchId role twitchToken").exec();

	if (users.length == 0) {
		return false;
	}

	const authProvider = await createAuthProvider();
	let token;

	for (let i = 0; i < users.length; i++) {
		token = tokenFormat(users[i].twitchToken);

		let intent = [`chat`];
		if (users[i].role != "bot") {
			intent = [`pubsub:${users[i].twitchId}`];
		}

		authProvider.addUser(users[i].twitchId, token, intent);
	}

	apiClient = createApiClient(authProvider);
	chatClient = await createChatClient(authProvider);
	pubSubClient = createPubSubClient(authProvider);

	return true;
}

async function createAuthProvider() {
	let authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
	});

	authProvider.onRefresh(async (twitchId, token) => {
		console.log("refresh");
		await updateUserTwitchToken(twitchId, token);
	});

	return authProvider;
}

async function updateUserTwitchToken(twitchId, token) {
	let user = await User.findOne(
		{
			twitchId: twitchId,
		},
		"twitchToken"
	).exec();

	if (!user) {
		user = new User({
			twitchId: twitchId,
			joinDate: new Date(),
		});
	}

	user.twitchToken = tokenFormat(token);
	user.save();
}

function tokenFormat(token) {
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		scope: token.scope,
		expiresIn: token.expiresIn,
		obtainmentTimestamp: token.obtainmentTimestamp,
	};
}

function createApiClient(authProvider) {
	return new ApiClient({ authProvider });
}

async function createChatClient(authProvider) {
	return new ChatClient({
		authProvider,
		channels: await getUsernames(),
		requestMembershipEvents: true,
	});
}

function createPubSubClient(authProvider) {
	new PubSubClient({ authProvider });
}

async function getUsernames() {
	let usersFromDb = await User.find({ role: { $ne: "bot" } }, "twitchId");
	let twitchIds = usersFromDb.map((user) => user.twitchId);

	let usersFromTwitch = await apiClient.users.getUsersByIds(twitchIds);
	let usernames = usersFromTwitch.map((user) => user.name);

	return usernames;
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
