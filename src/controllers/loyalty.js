const { getChattersPaginated } = require("../services/twitch/chat");
const { getChannelFollowersPaginated } = require("../services/twitch/channels");
const { find, insertMany } = require("../queries/loyaltyPoints");

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

		const subs = await twitchService.getSubscriptionsForUsers(
			channelId,
			userIds
		);

		const existingUsers = await find({
			channelId,
			userId: { $in: userIds },
		}).exec();

		let newUsers = chatters.filter(
			(user) => !existingUsers.find((exUser) => exUser.userId == user.userId)
		);

		await createUser(channelId, newUsers, subs);
	}, 5 * 60 * 1000);
}

async function listChatters(chat) {
	let chatPage = await chat.getNext();
	if (chatPage.length == 0) return;
	const chatters = [];

	while (chatPage.length > 0) {
		chatters = chatters.concat(chatPage);
		chatPage = await chat.getNext();
	}
	return chatters;
}

async function createUser(channelId, users, subs) {
	const newUsers = [];
	let newFollowBonus;
	let following;
	let modifier;

	const followers = await getChannelFollowersPaginated(channelId);

	users.forEach((value, key) => {
		followers.some((follower) => {
			let following = false;
			let newfollowBonus = 0;
			if (follower.userId === value.userId) {
				following = true;
				newfollowBonus = 2000;
			}

			modifier = getModifier(users[i], subs);
		});
	});

	for (let i = 0; i < users.length; i++) {
		let channelFollower = await twitchService.getChannelFollowers(
			channelId,
			users[i].userId
		);

		if (channelFollower.data.length == 1) {
			following = true;
			newFollowBonus = 2000;
		} else {
			following = false;
			newFollowBonus = 0;
		}

		modifier = getModifier(users[i], subs);

		newUsers.push({
			channelId,
			userId: users[i].userId,
			points: 10 * modifier + newFollowBonus,
			follower: following,
		});
	}

	await insertMany(newUsers);
}

function getModifier(user, subs) {
	let mod = 1;
	let sub;

	sub = subs.find((sub) => sub.userId === user.userId);

	if (!sub) return mod;

	mod = sub.tier === 1000 ? 1.2 : sub.tier === 2000 ? 1.4 : 2;

	return mod;
}

module.exports = {
	start,
	stop,
};
