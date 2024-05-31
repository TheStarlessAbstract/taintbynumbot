require("dotenv").config();

const db = require("../../../bot-mongoose.js");

const User = require("../../../models/user.js");
const Messages = require("../../../models/message.js");
const UserNew = require("../../models/usernew.js");

async function init() {
	let list = [];
	const dbStatus = await db.getReadyState();
	if (dbStatus === "Mongoose disconnected") {
		await db.connectToMongoDB();
	}

	const users = await User.find({});
	for (let i = 0; i < users.length; i++) {
		const user = {
			channelId: users[i].twitchId,
			displayName:
				users[i].role === "bot" ? "TaintByNumBot" : "TheStarlessAbstract",
			role: users[i].role,
			joinDate: users[i].joinDate,
			tokens: new Map(),
		};

		if (users[i]?.twitchToken) {
			user.tokens.set("twitch", {
				tokenType: "twitch",
				accessToken: users[i].twitchToken.accessToken,
				refreshToken: users[i].twitchToken.refreshToken,
				scope: users[i].twitchToken.scope,
				expiresIn: users[i].twitchToken.expiresIn,
				obtainmentTimestamp: users[i].twitchToken.obtainmentTimestamp,
			});
		}

		if (users[i]?.spotifyToken) {
			user.tokens.set("spotify", {
				tokenType: "spotify",
				accessToken: users[i].twitchToken.accessToken,
				refreshToken: users[i].twitchToken.refreshToken,
				scope: users[i].twitchToken.scope,
				expiresIn: users[i].twitchToken.expiresIn,
				obtainmentTimestamp: new Date(),
			});
		}

		if (user.displayName === "TheStarlessAbstract") {
			const oldMessages = await Messages.find({ twitchId: user.channelId });
			const messages = [];
			for (let i = 0; i < oldMessages.length; i++) {
				messages.push({
					index: oldMessages[i].index,
					text: oldMessages[i].text,
					addedBy: oldMessages[i].addedBy,
				});
			}
			user.messages = messages;
			user.messageCountTrigger = 1;
			user.messageIntervalLength = 0.5;
		}

		list.push(user);
	}

	await UserNew.insertMany(list);

	if (dbStatus === "Mongoose disconnected") {
		await db.disconnectFromMongoDB();
	}
}

module.exports = init;
