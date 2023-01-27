const kings = require("./kings");

let COOLDOWN = 5000;
let timer;

const getCommand = () => {
	return {
		response: async () => {
			let result = [];
			let currentTime = new Date();

			if (currentTime - timer > COOLDOWN) {
				timer = currentTime;

				let cardsToDraw = kings.getCardsToDraw();
				let cardsRemain = cardsToDraw.filter((card) => {
					return card.isDrawn == false;
				});

				result.push("Cards remaing in this game " + cardsRemain.length);
			}
			return result;
		},
		versions: [
			{
				description:
					"Checks how many cards remaining in the deck for the current game of !kings",
				usage: "!kingsremain",
				usableBy: "users",
			},
		],
	};
};

function setTimer(newTimer) {
	timer = newTimer;
}

exports.getCommand = getCommand;
exports.setTimer = setTimer;
