const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const kings = require("./kings");

const helper = new Helper();

let cooldown = 3000;

let commandResponse = () => {
	return {
		response: async () => {
			let result = [];
			let currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					kingsRemain.getTimer(),
					kingsRemain.getCooldown()
				)
			) {
				kingsRemain.setTimer(currentTime);

				let cardsToDraw = kings.getCardsToDraw();
				let cardsRemain = cardsToDraw.filter((card) => {
					return card.isDrawn == false;
				});

				result.push("Cards remaining in this game " + cardsRemain.length);
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
