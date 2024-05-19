const Helper = require("./classes/helper");

const twitchRepo = require("./repos/twitch");
const twitchService = require("./services/twitch");
const commands = require("./bot-commands");
const loyalty = require("./bot-loyalty");
const messages = require("./bot-messages");
const kings = require("./commands/kings");
const onMessage = require("./src/handlers/onMessageHandler");

const User = require("./models/user");

const helper = new Helper();

let chatClient;
let issuesRaised;
const users = new Map();

async function init() {
	chatClient = twitchRepo.getChatClient();

	if (!helper.isTest()) {
		chatClient.connect();
		await setupChatClientListeners();
	}
}

async function setupChatClientListeners() {
	chatClient.onAuthenticationSuccess(async () => {
		connected();
		checkLive();

		if (!helper.isTest()) {
			// kings.resetKings();
			await commands.setup();
		}
	});

	onMessage.init();
	chatClient.onMessage(async (channel, user, message, msg) => {
		onMessage.handler(channel, user, message, msg);
	});
}

async function connected() {
	console.log(" * Connected to Twitch chat * ");
}

async function checkLive() {
	await updateUsers();
	setInterval(async () => {
		await updateUsers();
		await checkStreamsLive();

		users.forEach((value, key) => {
			if (value.isLive && !value.lastIsLiveUpdate) {
				value.lastIsLiveUpdate = true;
				setTimedMessages(value);
				if (!helper.isTest()) {
					loyalty.start(value.id);
				}
			} else if (!value.isLive && value.lastIsLiveUpdate) {
				value.lastIsLiveUpdate = false;

				clearInterval(value.timedMessagesInterval);
				loyalty.stop(value.id);
			}
		});
	}, 5 * 60 * 1000);
}

async function updateUsers() {
	let usersFromDb = await User.find(
		{ role: { $ne: "bot" } },
		"twitchId"
	).exec();

	for (let userFromDb of usersFromDb) {
		if (!users.has(userFromDb.twitchId)) {
			users.set(userFromDb.twitchId, {
				id: userFromDb.twitchId,
				isLive: false,
				lastIsLiveUpdate: false,
				messageCount: 0,
			});
		}
	}

	// let usersToRemove = [];
	// for (let i = 0; i < users.length; i++) {
	// 	// looking user in users whose id does not match any userFromDb
	// 	if (!usersFromDb.some((userFromDb) => userFromDb.twitchId == users[i].id)) {
	// 		usersToRemove.push(i);
	// 		clearInterval(users[i].timedMessagesInterval);
	// 		loyalty.stop(users[i].id);
	// 	}
	// }

	// usersToRemove.sort((a, b) => {
	// 	return b - a;
	// });

	// for (let index of usersToRemove) {
	// 	users.splice(index, 1);
	// }
}

async function checkStreamsLive() {
	let streams = await twitchService.getStreamsByUserIds(getUserIds());

	users.forEach((value, key) => {
		value.isLive = streams.some((stream) => {
			if (stream.userId !== value.id) {
				return false;
			}

			return true;
		});
	});
}

async function setTimedMessages(value) {
	value.messages = await messages.get(value.id);
	let user = await twitchService.getUserById(value.id);

	value.channelName = user.name;

	value.timedMessagesInterval = setInterval(async () => {
		if (value.messageCount >= 25) {
			const [message] = value.messages.splice(
				helper.getRandomBetweenExclusiveMax(0, value.messages.length),
				1
			);

			chatClient.say(
				`${value.channelName}`,
				`${message.index}. ${message.text}`
			);
			value.messageCount = 0;

			if (value.messages.length == 0) {
				value.messages = await messages.get(value.id);
			}
		}
	}, 10 * 60 * 1000);
}

function getUserIds() {
	let userIds = [...users.keys()];

	return userIds;
}

function updateMessages(twitchId, messages) {
	let index = users.indexOf((user) => user.id === twitchId);
	users[index].messages = messages;
}

exports.init = init;
exports.updateMessages = updateMessages;
