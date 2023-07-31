const ApiClient = require("@twurple/api").ApiClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const redemptions = require("./bot-redemptions");
const loyalty = require("./bot-loyalty");

let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;
let userId = process.env.TWITCH_USER_ID;

let apiClient;
let token;

async function setup() {
	token = await Token.findOne({ name: "nextAuthTest" });

	if (token) {
		const tokenData = initializeTokenData(token);
		const authProvider = await createAuthProvider(tokenData);
		const pubSubClient = new PubSubClient({ authProvider });
		const apiClient = new ApiClient({ authProvider });

		setApiClient(apiClient);
		redemptions.setApiClient(apiClient);
		loyalty.setup(apiClient);
		const listener = await redemptions.setup(pubSubClient, userId); // check io
	}
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

function setApiClient(newApiClient) {
	apiClient = newApiClient;
}

async function getApiClient() {
	if (!apiClient) {
		await setup();
	}
	return apiClient;
}

exports.setup = setup;
exports.getApiClient = getApiClient;
