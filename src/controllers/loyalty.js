const { getChattersPaginated } = require("../services/twitch/chat");
const { getChannelFollowersPaginated } = require("../services/twitch/channels");
const {
	getSubscriptionsForUsers,
} = require("../services/twitch/subscriptions");
const { find, insertMany, bulkWrite } = require("../queries/loyaltyPoints");

const intervals = new Map();

function start(channelId) {
	intervals.set(channelId, createInterval(channelId));
}
function stop(channelId) {
	const interval = intervals.get(channelId);
	interval.stop();
}

function createInterval(channelId) {
	return setInterval(async () => {
		const chat = await getChattersPaginated(channelId);
		const chatters = await listChatters(chat);
		if (chatters.length == 0) return;

		const userIds = [];
		for (let i = 0; i < chatters.length; i++) {
			userIds.push(chatters[i].userId);
		}

		const subs = await getSubscriptionsForUsers(channelId, userIds);

		const existingUsers = await find({
			channelId,
			viewerId: { $in: userIds },
		});

		const newUsers = chatters.filter(
			(user) => !existingUsers.find((exUser) => exUser.viewerId == user.userId)
		);

		const followers = await getChannelFollowersPaginated(channelId);
		await createUser(channelId, newUsers, subs, followers);

		const test = existingUsers.map((value) => {
			let newFollowBonus = 0;
			let userIsFollower;
			if (!value.follower)
				userIsFollower = followers.some((follower) => {
					follower.userId === value.viewerId;
				});

			if (userIsFollower) {
				value.follower = true;
				newFollowBonus = 2000;
			}

			modifier = getModifier(value.viewerId, subs);
			value.points += 10 * modifier + newFollowBonus;

			return {
				updateOne: {
					filter: { _id: value._id },
					update: { $set: value.toObject() },
				},
			};
		});

		if (test.length > 0) await bulkWrite(test);
	}, 5 * 60 * 1000);
}

async function listChatters(chat) {
	let chatPage = await chat.getNext();
	if (chatPage.length == 0) return;
	let chatters = [];

	while (chatPage.length > 0) {
		chatters = chatters.concat(chatPage);
		chatPage = await chat.getNext();
	}
	return chatters;
}

async function createUser(channelId, users, subs, followers) {
	const newUsers = [];

	users.forEach((value, key) => {
		const userIsFollower = followers.some((follower) => {
			return follower.userId === value.userId;
		});
		let following = false;
		let newFollowBonus = 0;
		if (userIsFollower) {
			following = true;
			newFollowBonus = 2000;
		}
		let modifier = getModifier(value.userId, subs);
		newUsers.push({
			channelId,
			viewerId: value.userId,
			points: 10 * modifier + newFollowBonus,
			follower: following,
		});
	});
	await insertMany(newUsers);
}

function getModifier(userId, subs) {
	let mod = 1;
	let sub;

	sub = subs.find((sub) => sub.userId === userId);
	if (sub) mod = sub.tier === "1000" ? 1.2 : sub.tier === "2000" ? 1.4 : 2;

	return mod;
}

module.exports = {
	start,
	stop,
};
