require("dotenv").config();
const ChatClient = require("@twurple/chat").ChatClient;
const fs = require("fs").promises;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const commands = require("./bot-commands");

let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;

let token;
let tokenData;

async function setup() {
	try {
		token = await Token.findOne({ name: "chatClient" });
		tokenData = JSON.parse(
			await fs.readFile("./files/chatToken.json", "UTF-8")
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
				"./files/chatToken.json",
				JSON.stringify(tokenData, null, 4),
				"UTF-8"
			);
		}
	}

	if (tokenData) {
		if (!token) {
			token = new Token({ name: "chatClient" });
		}

		const authProvider = new RefreshingAuthProvider(
			{
				clientId,
				clientSecret,
				onRefresh: async (newTokenData) => {
					await fs.writeFile(
						"./files/chatToken.json",
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
		const chatClient = new ChatClient({
			authProvider,
			channels: [process.env.TWITCH_USERNAME],
		});

		await chatClient.connect(chatClient);
		await chatClient.onConnect(onConnectedHandler());

		chatClient.onMessage(async (channel, user, message, msg) => {
			let userInfo = msg.userInfo;
			const isBroadcaster = userInfo.isBroadcaster;
			const isMod = userInfo.isMod;
			const isVip = userInfo.isVip;
			const isSub = userInfo.isSub;
			const isModUp = isBroadcaster || isMod;
			const isNotBot = user != process.env.TWITCH_BOT_USERNAME;
			const isNotBuhhs = user != "buhhsbot";

			if (!isNotBot || !isNotBuhhs) {
				return;
			} else {
				if (message.startsWith("!")) {
					let command = message.split(/\s(.+)/)[0].slice(1);
					let argument = message.split(/\s(.+)/)[1];

					const { response } =
						(await commands.list[command.toLowerCase()]) || {};

					if (typeof response === "function") {
						let result = await response({
							isModUp: isModUp,
							userInfo: userInfo,
							argument: argument,
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
			}
		});

		commands.setApiClient(authProvider);
		commands.setAllTimeStreamDeaths();
	}
}

async function onConnectedHandler() {
	console.log(" * Connected to Twitch chat * ");
}

exports.setup = setup;
