const ApiClient = require("@twurple/api").ApiClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const User = require("./../models/user");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

let pubSubClient;
let apiClient;

async function init() {
	let users = await User.find({}, "twitchId twitchToken").exec();

	if (users.length == 0) {
		return false;
	}

	const authProvider = await createAuthProvider();
	let token;

	for (let i = 0; i < users.length; i++) {
		token = tokenFormat(users.twitchToken);

		authProvider.addUser(users[i].twitchId, token, [
			`pubsub:${users[i].twitchId}`,
		]);
	}

	pubSubClient = new PubSubClient({ authProvider });
	apiClient = new ApiClient({ authProvider });
	return true;
}

async function createAuthProvider() {
	let authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
	});

	authProvider.onRefresh(async (twitchId, token) => {
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

function getPubSubClient() {
	return pubSubClient;
}

function getApiClient() {
	return apiClient;
}

exports.init = init;
exports.getPubSubClient = getPubSubClient;
exports.getApiClient = getApiClient;
