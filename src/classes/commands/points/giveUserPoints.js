const { findOne } = require("../../../queries/loyaltyPoints");
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

	const user = await findOne(
		{
			channelId: config.channelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);
	if (!user) {
		output = this.getProcessedOutputString(
			this.getOutput("userNotFound"),
			config.configMap
		);
		return output;
	}

	let { first: giftTo, second: giftAmount } = splitArgs(config.argument, 0);
	let outputType = "noParams";
	if (isNonEmptyString(giftTo) && isValueNumber(giftAmount)) {
		if (giftTo.startsWith("@")) {
			giftTo = giftTo.substring(1);
		}
		outputType = "gifted";
		user.points += giftAmount;
		config.configMap.set("giftAmount", giftAmount);
		config.configMap.set("giftTo", giftTo);
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
	if (outputType == "gifted") await user.save();

	return output;
};

module.exports = giveUserPoints;
