const BaseCommand = require("./baseCommand.js");
const { findOne } = require("../../queries/loyaltyPoints");
const isValueNumber = require("../../utils/valueChecks/isValueNumber.js");

async function action(config) {
	if (
		config.versionKey !== "noArgument" &&
		config.versionKey !== "stringArgument"
	)
		return;

	let output;
	let outputType;
	const user = await findOne(
		{
			channelId: config.channelId,
			viewerId: config.userId,
		},
		{ points: 1 }
	);

	outputType = "userNotFound";

	if (config.versionKey == "noArgument" && user) {
		outputType = "userPoints";
		if (user) config.configMap.set("points", user.pointspoints);
	}
	if (config.versionKey == "stringArgument" && user) {
		const { a: giftTo, b: giftAmount } = this.getArgumentParams(
			config.argument
		);
		outputType = "noParams";

		if (isNonEmptyString(giftTo) && isValueNumber(giftAmount)) {
			outputType = "gifted";
			user.points += giftAmount;
			config.configMap.set("giftAmount", giftAmount);
		}
	}

	output = this.getProcessedOutputString(
		this.getOutput(outputType),
		config.configMap
	);
	if (!output) outputType == "error";

	if (outputType == "gifted") await user.save();

	return output;
}

class Points extends BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		super(channelId, name, { type, output, versions });
	}

	action = action.bind(this);
}

module.exports = Points;
