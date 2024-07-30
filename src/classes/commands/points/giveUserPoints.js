const { findOne } = require("../../../queries/loyaltyPoints");
const { getUserByName } = require("../../../services/twitch/users");
const {
	isValueNumber,
	isNonEmptyString,
} = require("../../../utils/valueChecks");
const { splitArgs } = require("../../../utils/modify");

const giveUserPoints = async function (config) {
	if (config.versionKey !== "giveUserPoints") return;
	let output;

	if (!config?.permitted) {
		output = this.getProcessedOutputString(
			this.getOutput("notPermitted"),
			config.configMap
		);
		return output;
	}

	let { first: giftTo, second: giftAmount } = splitArgs(config.argument, 0);
	if (!isNonEmptyString(giftTo) || !isValueNumber(giftAmount))
		return this.getProcessedOutputString(
			this.getOutput("noParams"),
			config.configMap
		);

	if (giftTo.startsWith("@")) {
		giftTo = giftTo.substring(1);
	}

	const twitchUser = await getUserByName(giftTo);

	const dbUser = await findOne(
		{
			channelId: this.channelId,
			viewerId: twitchUser.id,
		},
		{ points: 1 }
	);
	if (!dbUser)
		return this.getProcessedOutputString(
			this.getOutput("userNotFound"),
			config.configMap
		);

	dbUser.points += giftAmount;
	config.configMap.set("giftAmount", giftAmount);
	config.configMap.set("giftTo", giftTo);

	output = this.getProcessedOutputString(
		this.getOutput("gifted"),
		config.configMap
	);
	await dbUser.save();

	return output;
};

module.exports = giveUserPoints;
