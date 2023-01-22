require("dotenv").config();
const ApiClient = require("@twurple/api").ApiClient;
const ChatClient = require("@twurple/chat").ChatClient;
const RefreshingAuthProvider = require("@twurple/auth").RefreshingAuthProvider;

const Token = require("./models/token");

const commands = require("./bot-commands");
const deathCounter = require("./bot-deathcounter");
const messages = require("./bot-messages");
const redemptions = require("./bot-redemptions");
const loyalty = require("./bot-loyalty");

let clientId = process.env.TWITCH_CLIENT_ID;
let clientSecret = process.env.TWITCH_CLIENT_SECRET;
let username = process.env.TWITCH_USERNAME;
let botUsername = process.env.TWITCH_BOT_USERNAME;
let userId = process.env.TWITCH_USER_ID;

let token;
let timedMessagesInterval;
let intervalMessages;
let isLive = false;
let messageCount = 0;
let tempchannel;

async function setup() {
	// Initialize the commands and messages modules
	await commands.setup();
	await messages.setup();

	// Check if the token exists in the database
	token = await Token.findOne({ name: "chatClient" });

	if (token) {
		// If the token exists, create the tokenData object
		const tokenData = initializeTokenData(token);

		// Create the authProvider, chatClient and apiClient objects
		const authProvider = createAuthProvider(tokenData);
		const chatClient = createChatClient(authProvider);
		const apiClient = new ApiClient({ authProvider });

		await chatClient.connect(chatClient);

		setupChatClientListeners(apiClient, chatClient);

		commands.setAllTimeStreamDeaths();
	}
}

async function connected() {
	console.log(" * Connected to Twitch chat * ");
}

async function setupChatClientListeners(apiClient, chatClient) {
	chatClient.onRegister(async () => {
		connected();
		checkLive(apiClient, chatClient);

		commands.setApiClient(apiClient);
		commands.resetKings();
		commands.setChatClient(chatClient);
		redemptions.setChatClient(chatClient);
		await deathCounter.setup(apiClient);
	});

	await chatClient.onMessage(async (channel, user, message, msg) => {
		// increments messageCount for each message not by the bot, or buhhsbot
		messageCount++;

		// check for messages to be ignored
		if (shouldIgnoreMessage(user, botUsername, message)) return;

		const userInfo = msg.userInfo;
		const { isBroadcaster, isMod, isVip, isSub } = userInfo;
		const isModUp = isBroadcaster || isMod;

		// dropping the leading !, then spliting the message into command and argument, with command being the first word, and argument being the remaining words
		let [command, argument] = message.slice(1).split(/\s(.+)/);

		const { response, details } =
			(await commands.list[command.toLowerCase()]) || {};

		if (typeof response === "function") {
			let result = await response({
				isBroadcaster,
				isModUp,
				userInfo,
				argument,
			});

			if (result) {
				for (let i = 0; i < result.length; i++) {
					chatClient.say(channel, result[i]);
				}
			}
		} else if (typeof response === "string") {
			chatClient.say(channel, response);
		}
	});
}

function shouldIgnoreMessage(user, botUsername, message) {
	return (
		user === botUsername || user === "buhhsbot" || !message.startsWith("!")
	);
}

async function checkLive(apiClient, chatClient) {
	// Create an interval that will run every 5 minutes
	setInterval(async () => {
		// Check if the stream is live
		let streamLiveFlag = await isStreamLive(apiClient);

		// Check if streamLiveFlag is true and the isLive variable is false
		if (streamLiveFlag && !isLive) {
			// If the streamLiveFlag is tueand isLive is false, call setTimedMessages()
			// and set isLive to true
			setTimedMessages(chatClient);
			isLive = true;
		} else if (!streamLiveFlag && isLive) {
			// If the streamLiveFlag is false and isLive is true, clear the interval,
			// call loyalty.stop(), and set isLive to false
			clearInterval(timedMessagesInterval);
			loyalty.stop();
			isLive = false;
		}
	}, 5 * 60 * 1000);
}

async function setTimedMessages(chatClient) {
	// Get the timed messages
	intervalMessages = messages.get();

	// Initialize the interval for sending timed messages
	timedMessagesInterval = setInterval(async () => {
		if (messageCount >= 25) {
			// Get a random timed message and remove it from the array
			const [message] = intervalMessages.splice(
				getRandomBetween(0, intervalMessages.length),
				1
			);

			// Send the message text to the chat
			chatClient.say("#" + username, message.text);

			// Reset the message count
			messageCount = 0;

			// If the intervalMessages array is empty, get a new array of messages
			if (intervalMessages.length === 0) {
				intervalMessages = messages.get();
			}
		}
	}, 10 * 60 * 1000);
}

function getRandomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function messageUpdate(update) {
	intervalMessages = update;
}

function initializeTokenData(token) {
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		scope: token.scope,
		expiresIn: 0,
		obtainmentTimestamp: 0,
	};
}

function createAuthProvider(tokenData) {
	return new RefreshingAuthProvider(
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
}

function createChatClient(authProvider) {
	return new ChatClient({
		authProvider,
		channels: [username],
		requestMembershipEvents: true,
	});
}

async function isStreamLive(apiClient) {
	let streamStatus;

	try {
		let stream = await apiClient.streams.getStreamByUserId(userId);

		if (stream == null) {
			streamStatus = false;
		} else {
			streamStatus = true;
		}
	} catch {
		streamStatus = false;
	}

	return streamStatus;
}

exports.setup = setup;
exports.messageUpdate = messageUpdate;
