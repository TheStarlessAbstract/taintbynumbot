require("dotenv").config();
const ApiClient = require("@twurple/api").ApiClient;
const ChatClient = require("@twurple/chat").ChatClient;
const fs = require("fs").promises;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const commands = require("./bot-commands");
const messages = require("./bot-messages");
const redemptions = require("./bot-redemptions");

let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;
let username = process.env.TWITCH_USERNAME;
let botUsername = process.env.TWITCH_BOT_USERNAME;

let token;
let tokenData;
let interval;
let intervalMessages;
let chatClient;
let isLive = false;
let messageCount = 0;

async function setup() {
	await commands.setup();
	await messages.setup();

	try {
		token = await Token.findOne({ name: "chatClient" });
		await fs.mkdir("./files", { recursive: true });
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
		chatClient = new ChatClient({
			authProvider,
			channels: [username],
			requestMembershipEvents: true,
		});

		const apiClient = new ApiClient({ authProvider });

		await chatClient.connect(chatClient);
		chatClient.onRegister(async () => {
			connected();
			checkLive();
			commands.setApiClient(apiClient);
			redemptions.setChatClient(chatClient);
			redemptions.resetKings();
		});

		await chatClient.onMessage(async (channel, user, message, msg) => {
			let userInfo = msg.userInfo;
			const isBroadcaster = userInfo.isBroadcaster;
			const isMod = userInfo.isMod;
			const isVip = userInfo.isVip;
			const isSub = userInfo.isSub;
			const isModUp = isBroadcaster || isMod;
			const isNotBot = user != botUsername;
			const isNotBuhhs = user != "buhhsbot";

			if (!isNotBot || !isNotBuhhs) {
				return;
			} else {
				messageCount++;
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

		commands.setAllTimeStreamDeaths();
	}
}

async function connected() {
	console.log(" * Connected to Twitch chat * ");
}

function checkLive() {
	setInterval(async () => {
		try {
			if ((await isStreamLive()) && !isLive) {
				setTimedMessages();
				isLive = true;
			} else if ((await !isStreamLive()) && isLive) {
				clearInterval(interval);
				isLive = false;
			}
		} catch (error) {}
	}, 900000);
}

async function setTimedMessages() {
	intervalMessages = messages.get();

	interval = setInterval(async () => {
		if (messageCount >= 25) {
			let message = getRandom(intervalMessages);

			intervalMessages = intervalMessages.filter((e) => e !== message);
			if (intervalMessages.length == 0) {
				intervalMessages = messages.get();
			}

			await chatClient.say(username, message.text);
			messageCount = 0;
		}
	}, 600000);
}

function getRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function messageUpdate(update) {
	intervalMessages = update;
}

async function isStreamLive() {
	let isLive;

	try {
		let stream = await apiClient.streams.getStreamByUserId(
			process.env.TWITCH_USER_ID
		);

		if (stream == null) {
			isLive = false;
		} else {
			isLive = true;
		}
	} catch {
		isLive = false;
	}

	return true;
}

exports.setup = setup;
exports.messageUpdate = messageUpdate;
