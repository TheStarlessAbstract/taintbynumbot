const LoyaltyPoint = require("./models/loyaltypoint");

let twitchUserId = process.env.TWITCH_USER_ID;

let apiClient;
let isLive;
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
		let chatPaginated = await apiClient.chat.getChattersPaginated(
			twitchUserId,
			twitchUserId
		);

		let currentPageUsers = await chatPaginated.getNext();
		let currentUsersList = [];

		while (currentPageUsers.length > 0) {
			currentUsersList = currentUsersList.concat(currentPageUsers);
			currentPageUsers = await chatPaginated.getNext();
		}

		// creating list of userIds
		let userIds = [];
		for (let i = 0; i < currentUsersList.length; i++) {
			userIds.push(currentUsersList[i].userId);
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
			newUsers = currentUsersList.filter(
				(user) =>
					!!!existingUsers.find((exUser) => exUser.userId == user.userId)
			);

			await createUser(newUsers);
		} else {
			await createUser(currentUsersList);
		}

		let channelFollower;
		for (let i = 0; i < existingUsers.length; i++) {
			followingUser = currentUsersList.find(
				(chatUser) => chatUser.userId == existingUsers[i].userId
			);

			if (!existingUsers[i].follower) {
				channelFollower = await apiClient.channels.getChannelFollowers(
					twitchUserId,
					twitchUserId,
					followingUser.userId
				);

				if (channelFollower.data.length == 1) {
					newFollowBonus = 2000;
					existingUsers[i].follower = true;
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
	let channelFollower;

	for (let i = 0; i < array.length; i++) {
		channelFollower = await apiClient.channels.getChannelFollowers(
			twitchUserId,
			twitchUserId,
			array[i].userId
		);

		if (channelFollower.data.length == 1) {
			following = true;
			newFollowBonus = 2000;
		} else {
			following = false;
			newFollowBonus = 0;
		}
		modifier = getModifier(array[i]);
		newUser = new LoyaltyPoint({
			username: array[i].userName,
			userId: array[i].userId,
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
