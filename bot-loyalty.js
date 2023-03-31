const LoyaltyPoint = require("./models/loyaltypoint");

let twitchUsername = process.env.TWITCH_USERNAME;
let twitchUserId = process.env.TWITCH_USER_ID;

let apiClient;
let isLive;
let currentChat;
let existingUsers = [];
let newUsers;
let subs;

let loyaltyInterval;

async function setup(apiClient) {
	setApiClient(apiClient);

	if (process.env.JEST_WORKER_ID == undefined) {
		chatInterval();
	}
}

function chatInterval() {
	let followingUser;
	loyaltyInterval = setInterval(async () => {
		let userIds = [];
		// gets all users in chat
		currentChat = await apiClient.unsupported.getChatters(twitchUsername);
		let chat = currentChat.allChatters;

		subs = [];

		// gets user info by name
		let chatUsers = await apiClient.users.getUsersByNames(chat);

		// creating list of userIds
		for (let i = 0; i < chatUsers.length; i++) {
			userIds.push(chatUsers[i].id);
		}

		// gets array of subs in chat
		subs = await apiClient.subscriptions.getSubscriptionsForUsers(
			twitchUserId,
			userIds
		);

		existingUsers = await LoyaltyPoint.find({
			userId: { $in: userIds },
		}).exec();

		if (existingUsers.length > 0) {
			newUsers = chatUsers.filter(
				(user) => !!!existingUsers.find((exUser) => exUser.userId == user.id)
			);

			createUser(newUsers);
		} else {
			createUser(chatUsers);
		}

		for (let i = 0; i < existingUsers.length; i++) {
			followingUser = chatUsers.find(
				(chatUser) => chatUser.id == existingUsers[i].userId
			);

			if (!existingUsers[i].follower) {
				if (await followingUser.follows(twitchUserId)) {
					newFollowBonus = 2000;
				} else {
					newFollowBonus = 0;
				}
			} else {
				newFollowBonus = 0;
			}
			modifier = getModifier(existingUsers[i]);
			existingUsers[i].points += 10 * modifier + newFollowBonus;

			await existingUsers[i].save();
		}
	}, 300000);
}

async function createUser(array) {
	// if broadcaster ignore, remove from array earlier
	let newUser;
	let newFollowBonus = 0;
	let following;
	let modifier;

	for (let i = 0; i < array.length; i++) {
		if (await array[i].follows(twitchUserId)) {
			following = true;
			newFollowBonus = 2000;
		} else {
			following = false;
			newFollowBonus = 0;
		}

		modifier = getModifier(array[i]);

		newUser = new LoyaltyPoint({
			username: array[i].name,
			userId: array[i].id,
			points: 10 * modifier + newFollowBonus,
			follower: following,
		});

		await newUser.save();
	}
}

function getModifier(user) {
	let mod = 1;
	let sub;

	if (typeof user == "object") {
		if (user.userId) {
			sub = subs.find((sub) => sub.userId == user.userId);
		} else {
			sub = subs.find((sub) => sub.userId == user.id);
		}
	}

	if (sub) {
		mod = sub.tier == 1000 ? 1.2 : sub.tier == 2000 ? 1.4 : 2;
	}

	return mod;
}

function setApiClient(newApiClient) {
	apiClient = newApiClient;
}

function setIsLive(liveBool) {
	isLive = liveBool;
}

function stopInterval() {
	clearInterval(loyaltyInterval);
}

exports.setup = setup;
exports.setIsLive = setIsLive;
exports.start = chatInterval;
exports.stop = stopInterval;
