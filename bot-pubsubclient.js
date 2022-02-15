require("dotenv").config();
const fs = require("fs").promises;
const ApiClient = require("@twurple/api").ApiClient;
const PubSubClient = require("@twurple/pubsub").PubSubClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const redemptions = require("./bot-redemptions");

let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;

let token;
let tokenData;

async function setup() {
	try {
		token = await Token.findOne({ name: "pubSubClient" });
		tokenData = JSON.parse(
			await fs.readFile("./files/pubSubToken.json", "UTF-8")
		);
	} catch (error) {
		if (token) {
			tokenData = {
				accessToken: token.accessToken,
				refreshToken: token.refreshToken,
				scope: token.scope,
				expiresIn: 0,
				obtainmentTimestamp: 0,
			};

			await fs.writeFile(
				"./files/pubSubToken.json",
				JSON.stringify(tokenData, null, 4),
				"UTF-8"
			);
		}
	}

	if (tokenData) {
		if (!token) {
			token = new Token({ name: "pubSubClient" });
		}

		const authProvider = new RefreshingAuthProvider(
			{
				clientId,
				clientSecret,
				onRefresh: async (newTokenData) => {
					await fs.writeFile(
						"./files/pubSubToken.json",
						JSON.stringify(newTokenData, null, 4),
						"UTF-8"
					);
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
		const listener = await redemptions.setup(pubSubClient, userId); // check io
	}
}

exports.setup = setup;
