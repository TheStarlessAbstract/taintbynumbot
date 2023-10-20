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

	for (let i = 0; i < users.length; i++) {
		authProvider.addUser(users[i].twitchId, users[i].twitchToken, [
			`pubsub:${users[i].twitchId}`,
		]);
	}

	pubSubClient = new PubSubClient({ authProvider });
	apiClient = new ApiClient({ authProvider });

	let followers;
	let list;
	for (let i = 0; i < users.length; i++) {
		followers = await apiClient.channels.getChannelFollowersPaginated(
			users[i].twitchId
		);

		list = await followers.getNext();

		console.log(list);
	}

	return true;
}

async function createAuthProvider() {
	console.log(1);
	let authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
		onRefresh: async (twitchId, token) => {
			// if (process.env.JEST_WORKER_ID == undefined) {
			console.log(2);
			await updateUserTwitchToken(twitchId, token);
			console.log(3);
			// }
		},
	});
	console.log(4);
	return authProvider;
}

async function updateUserTwitchToken(twitchId, token) {
	let user = await User.findOne(
		{
			twitchId: twitchId,
		},
		"twitchToken"
	).exec();

	if (user) {
		user.twitchToken = {
			scope: token.scope,
			accessToken: token.access_token,
			refreshToken: token.refresh_token,
			expiresIn: 0,
			obtainmentTimestamp: 0,
		};
	} else {
		user = new User({
			twitchId: twitchId,
			joinDate: new Date(),
			twitchToken: {
				scope: token.scope,
				accessToken: token.access_token,
				refreshToken: token.refresh_token,
				expiresIn: 0,
				obtainmentTimestamp: 0,
			},
		});
	}

	user.save();
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
