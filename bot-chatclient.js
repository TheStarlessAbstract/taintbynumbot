const Helper = require("./classes/helper");

const twitchRepo = require("./repos/twitch");
const twitchService = require("./services/twitch");
const commands = require("./bot-commands");
const loyalty = require("./bot-loyalty");
const messages = require("./bot-messages");
const kings = require("./commands/kings");

const User = require("./models/user");
const CommandNew = require("./models/commandnew");

let botUsername = process.env.TWITCH_BOT_USERNAME;

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

	chatClient.onMessage(async (channel, user, message, msg) => {
		users.get(msg.channelId).messageCount++;

		if (shouldIgnoreMessage(user, botUsername, message)) return;

		if (!userInfoCheck(msg.userInfo)) {
			const config = msg.userInfo;
			let [command, argument] = message.slice(1).split(/\s(.+)/);
			let commandLink = commands.list[msg.channelId][command.toLowerCase()];

			if (commandLink == undefined) return;
			////
			// Can start DB query on active versions here
			const dad = await CommandNew.aggregate([
				{ $match: { streamerId, chatName } },
				{
					$project: {
						numberOfActiveVersions: {
							$size: {
								$filter: {
									input: "$versions",
									as: "version",
									cond: { $eq: ["$$version.active", true] },
								},
							},
						},
					},
				},
			]);
			// CommandNew ( for this chatName, and this channelId, check if any version active = true)
			////

			config.channelId = msg.channelId;
			config.argument = argument;
			//////////
			let versions = commandLink.getVersions();
			let hasActiveVersions =
				versions.filter(function (version) {
					return version.active;
				}).length > 0;

			if (!hasActiveVersions) return;
			//////////
			let response = await commandLink.getCommand();
			if (typeof response === "function") {
				let result = await response(config);

				if (!result) return;

				if (Array.isArray(result)) {
					for (let i = 0; i < result.length; i++) {
						chatClient.say(channel, result[i]);
					}
				} else {
					chatClient.say(channel, result);
				}
			} else if (typeof response === "string") {
				chatClient.say(channel, response);
			}
		} else {
			console.log("userInfo types changed");
		}
	});
}

async function connected() {
	if (!helper.isTest()) {
		console.log(" * Connected to Twitch chat * ");
	}
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

function shouldIgnoreMessage(user, botUsername, message) {
	return (
		user === botUsername || user === "buhhsbot" || !message.startsWith("!")
	);
}

function userInfoCheck(userInfo) {
	const stringTypes = [
		userInfo.color,
		userInfo.displayName,
		userInfo.userId,
		userInfo.userName,
		userInfo.userType,
	];

	const stringUndefinedTypes = [userInfo.color, userInfo.userType];

	const boolTypes = [
		userInfo.isArtist,
		userInfo.isBroadcaster,
		userInfo.isFounder,
		userInfo.isMod,
		userInfo.isSubscriber,
		userInfo.isVip,
	];
	const mappedTypes = [userInfo.badgeInfo, userInfo.badges];

	issuesRaised = false;

	stringTypes.forEach(confirmStrings);

	if (!issuesRaised) {
		stringUndefinedTypes.forEach(confirmStringsOrUndefined);
	}

	if (!issuesRaised) {
		boolTypes.forEach(confirmBools);
	}

	if (!issuesRaised) {
		mappedTypes.forEach(confirmMaps);
	}

	return issuesRaised;
}

function confirmStrings(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "string";
	}
}

function confirmStringsOrUndefined(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "string" || item == undefined;
	}
}

function confirmBools(item) {
	if (!issuesRaised) {
		issuesRaised = typeof item != "boolean";
	}
}

function confirmMaps(item) {
	if (!issuesRaised) {
		issuesRaised = !(item instanceof Map);
	}
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
