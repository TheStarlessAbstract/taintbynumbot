const { findOne } = require("../../queries/loyaltyPoints");
const { getUserByName } = require("../../services/twitch/users");
const { isValueNumber, isNonEmptyString } = require("../../utils/valueChecks");
const { splitArgs } = require("../../utils/modify");
const { getMaxListeners } = require("../../models/usernew");

const giveUserPoints = async function (config) {
	if (!config?.permitted)
		return this.getOutputString("notPermitted", config.configMap);

	let { first: giftTo, second: giftAmount } = splitArgs(config.argument, 0);
	if (!isNonEmptyString(giftTo) || !isValueNumber(giftAmount))
		return this.getOutputString("noParams", config.configMap);

	if (giftTo.startsWith("@")) giftTo = giftTo.substring(1);

	const twitchUser = await getUserByName(giftTo);

	const dbUser = await findOne(
		{
			channelId: this.channelId,
			viewerId: twitchUser.id,
		},
		{ points: 1 }
	);
	if (!dbUser) return this.getOutputString("userNotFound", config.configMap);

	dbUser.points += giftAmount;
	config.configMap.set("giftAmount", giftAmount);
	config.configMap.set("giftTo", giftTo);

	await dbUser.save();
	return this.getOutputString("gifted", config.configMap);
};

module.exports = giveUserPoints;
