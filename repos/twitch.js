const ApiClient = require("@twurple/api").ApiClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

let pubSubClient;
let apiClient;

async function init() {
	let state;
	let token = await Token.findOne({ name: "nextAuthTest" });

	if (token) {
		state = true;
		const tokenData = initializeTokenData(token);
		const authProvider = await createAuthProvider(tokenData);
		pubSubClient = new PubSubClient({ authProvider });
		apiClient = new ApiClient({ authProvider });
	} else {
		state = false;
		// something
	}

	return state;
}

function initializeTokenData(token) {
	return {
		twitchId: token.twitchId,
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

function getPubSubClient() {
	return pubSubClient;
}

function getApiClient() {
	return apiClient;
}

exports.init = init;
exports.getPubSubClient = getPubSubClient;
exports.getApiClient = getApiClient;
