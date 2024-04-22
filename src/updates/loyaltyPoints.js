require("dotenv").config();

const db = require("../../bot-mongoose.js");
const loyalty = require("../../bot-loyalty.js");

const User = require("../../models/user.js");
const LoyaltyPoints = require("../../models/loyaltypoint.js");
const LoyaltyPointsNew = require("../models/loyaltypointnew.js");

init();

async function init() {
	let list = [];
	await db.connectToMongoDB();

	const users = await User.find({ role: { $ne: "bot" } }, "twitchId").exec();
	const userIds = getUserIds(users);
	for (let i = 0; i < userIds.length; i++) {
		let points = await LoyaltyPoints.find({
			twitchId: userIds[i],
		});

		for (let j = 0; j < points.length; j++) {
			list.push({
				channelId: points[j].twitchId,
				viewerId: points[j].userId,
				points: points[j].points,
				follower: points[j].follower,
			});
		}
	}

	await LoyaltyPointsNew.insertMany(list);

	await db.disconnectFromMongoDB();
}

function getUserIds(users) {
	let userIds = [];

	for (let user of users) {
		userIds.push(user.twitchId);
	}

	return userIds;
}
