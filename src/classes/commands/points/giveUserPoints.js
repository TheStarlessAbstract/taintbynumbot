const { findOne } = require("../../../queries/loyaltyPoints");
const {
	isValueNumber,
	isNonEmptyString,
} = require("../../../utils/valueChecks");

const giveUserPoints = async function (config) {
	if (config.versionKey !== "giveUserPoints") return;

	let output;
	let outputType = "userPoints";
	const user = await findOne(
		{
			channelId: config.channelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);
	if (!user) outputType = "userNotFound";
	let { a: giftTo, b: giftAmount } = this.getArgumentParams(config.argument);
	outputType = "noParams";
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
