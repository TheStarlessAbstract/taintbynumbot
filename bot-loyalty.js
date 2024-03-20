const twitchService = require("./services/twitch");

const LoyaltyPoint = require("./models/loyaltypoint");

let userLoyalty = [];

function start(twitchId) {
	userLoyalty.push({ id: twitchId, interval: createInterval(twitchId) });
}

async function createInterval(twitchId) {
	return setInterval(async () => {
		let chatters = await getChatters(twitchId);

		if (chatters.length == 0) {
			return;
		}

		let userIds = [];
		for (let i = 0; i < chatters.length; i++) {
			userIds.push(chatters[i].userId);
		}

		let subs = await twitchService.getSubscriptionsForUsers(twitchId, userIds);

		let existingUsers = await LoyaltyPoint.find({
			twitchId: twitchId,
			userId: { $in: userIds },
		}).exec();

		let newUsers = chatters.filter(
			(user) => !existingUsers.find((exUser) => exUser.userId == user.userId)
		);

		createUser(twitchId, newUsers, subs);

		for (let i = 0; i < existingUsers.length; i++) {
			let newFollowBonus = 0;
			if (!existingUsers[i].follower) {
				let channelFollower = await twitchService.getChannelFollowers(
					twitchId,
					existingUsers[i].userId
				);

				if (channelFollower.data.length == 1) {
					newFollowBonus = 2000;
					existingUsers[i].follower = true;
				}
			}

			modifier = getModifier(existingUsers[i], subs);
			existingUsers[i].points += 10 * modifier + newFollowBonus;

			await existingUsers[i].save();
		}
	}, 5 * 60 * 1000);
}

async function createUser(twitchId, users, subs) {
	// if broadcaster ignore, remove from array earlier
	let newUsers = [];
	let newFollowBonus;
	let following;
	let modifier;

	for (let i = 0; i < users.length; i++) {
		let channelFollower = await twitchService.getChannelFollowers(
			twitchId,
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
			twitchId: twitchId,
			userId: users[i].userId,
			points: 10 * modifier + newFollowBonus,
			follower: following,
		});
	}

	await LoyaltyPoint.insertMany(newUsers);
}

function getModifier(user, subs) {
	let mod = 1;
	let sub;

	sub = subs.find((sub) => sub.userId == user.userId);

	if (sub) {
		mod = sub.tier == 1000 ? 1.2 : sub.tier == 2000 ? 1.4 : 2;
	}

	return mod;
}

async function getChatters(twitchId) {
	let chatters = [];
	let chattersPaginated = await twitchService.getChattersPaginated(twitchId);
	let currentPageChatters = await chattersPaginated.getNext();

	while (currentPageChatters.length > 0) {
		chatters = chatters.concat(currentPageChatters);
		currentPageChatters = await chattersPaginated.getNext();
	}

	return chatters;
}

function stop(twitchId) {
	let index = userLoyalty.findIndex((el) => el.id == twitchId);
	if (index != -1) {
		clearInterval(userLoyalty[index].interval);
		userLoyalty.splice(index, 1);
	}
}

exports.start = start;
exports.stop = stop;
