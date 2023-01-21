require("dotenv").config();
const fs = require("fs").promises;
const ApiClient = require("@twurple/api").ApiClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const redemptions = require("./bot-redemptions");
const loyalty = require("./bot-loyalty");

let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;

let token;
let tokenData;

async function setup() {
	token = await Token.findOne({ name: "pubSubClient" });
	if (token) {
		tokenData = {
			accessToken: token.accessToken,
			refreshToken: token.refreshToken,
			scope: token.scope,
			expiresIn: 0,
			obtainmentTimestamp: 0,
		};
	} else if (!token) {
		token = new Token({ name: "pubSubClient" });
	}

	if (tokenData) {
		const authProvider = new RefreshingAuthProvider(
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

		const pubSubClient = new PubSubClient();
		const userId = await pubSubClient.registerUserListener(authProvider);
		const apiClient = new ApiClient({ authProvider });
		redemptions.setApiClient(apiClient);
		loyalty.setup(apiClient);
		const listener = await redemptions.setup(pubSubClient, userId); // check io
	}
}

exports.setup = setup;
