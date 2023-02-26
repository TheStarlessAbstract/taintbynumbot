const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const kings = require("./kings");

const helper = new Helper();

let cooldown = 5000;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			let currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					kingsRemain.getTimer(),
					kingsRemain.getCooldown()
				) ||
				helper.isStreamer(config)
			) {
				kingsRemain.setTimer(currentTime);

				let cardsToDraw = kings.getCardsToDraw();
				let cardsRemain = cardsToDraw.filter((card) => {
					return card.isDrawn == false;
				});

				result.push("Cards remaing in this game " + cardsRemain.length);
			}
			return result;
		},
	};
};

let versions = [
	{
		description:
			"Checks how many cards remaining in the deck for the current game of !kings",
		usage: "!kingsremain",
		usableBy: "users",
		active: true,
	},
];

const kingsRemain = new TimerCommand(commandResponse, versions, cooldown);

exports.command = kingsRemain;
