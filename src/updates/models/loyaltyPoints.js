const User = require("../../../models/user.js");
const LoyaltyPoints = require("../../../models/loyaltypoint.js");
const LoyaltyPointsNew = require("../../models/loyaltypointnew.js");

async function init() {
	let list = [];

	const users = await User.find({ role: { $ne: "bot" } }, "twitchId").exec();
	const userIds = getUserIds(users);
	for (let i = 0; i < userIds.length; i++) {
		let points = await LoyaltyPoints.find({});

		for (let j = 0; j < points.length; j++) {
			list.push({
				channelId: "100612361",
				viewerId: points[j].userId,
				points: points[j].points,
				follower: points[j].follower,
			});
		}
	}

	await LoyaltyPointsNew.insertMany(list);
}

function getUserIds(users) {
	let userIds = [];

	for (let user of users) {
		userIds.push(user.twitchId);
	}

	return userIds;
}

module.exports = init;
