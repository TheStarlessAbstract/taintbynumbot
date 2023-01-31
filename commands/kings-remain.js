const kings = require("./kings");

let COOLDOWN = 5000;
let timer;

let versions = [
	{
		description:
			"Checks how many cards remaining in the deck for the current game of !kings",
		usage: "!kingsremain",
		usableBy: "users",
		active: true,
	},
];

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
	};
};

function setTimer(newTimer) {
	timer = newTimer;
}

function getVersions() {
	return versions;
}

function setVersionActive(element) {
	versions[element].active = !versions[element].active;
}

exports.getCommand = getCommand;
exports.getVersions = getVersions;
exports.setVersionActive = setVersionActive;
exports.setTimer = setTimer;
