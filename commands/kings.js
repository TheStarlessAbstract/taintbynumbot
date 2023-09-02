const audio = require("../bot-audio");
const gameBuilder = require("../bot-gamebuilder");

const TimerCommand = require("../classes/timer-command");
const Helper = require("../classes/helper");

const AudioLink = require("../models/audiolink");
const LoyaltyPoint = require("../models/loyaltypoint");

const helper = new Helper();

let cardsToDraw;
let cooldown = 5000;
let cost = 100;
let kingsCount;
let currentTime;

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];
			currentTime = new Date();

			if (
				helper.isCooldownPassed(
					currentTime,
					kings.getTimer(),
					kings.getCooldown()
				) ||
				helper.isStreamer(config.userInfo)
			) {
				kings.setTimer(currentTime);
				let redeemUser = config.userInfo.displayName;
				let canDraw = false;

				if (!helper.isStreamer(config.userInfo)) {
					let user = await LoyaltyPoint.findOne({
						userId: config.userInfo.userId,
					});

					if (user) {
						if (user.points >= cost) {
							user.points -= cost;

							await user.save();

							canDraw = true;
						} else {
							result.push(
								"@" +
									config.userInfo.displayName +
									" You lack the points to draw a card, hang about stream if you have nothing better to do, eventually you may be able to find a Jagerbomb"
							);
						}
					} else {
						result.push(
							"@" +
								config.userInfo.displayName +
								" I hate to say it, but it looks like you haven't been here for a whole 5 minutes yet. Hang around a bit longer to get your self some Tainty Points."
						);
					}
				} else {
					canDraw = true;
				}

				if (canDraw) {
					let drawFrom = cardsToDraw.filter((card) => card.isDrawn == false);
					let cardDrawn;

					if (drawFrom.length == 1) {
						cardDrawn = drawFrom[0];
						await resetKings();
					} else {
						cardDrawn =
							drawFrom[
								helper.getRandomBetweenInclusiveMax(0, drawFrom.length - 1)
							];
					}

					cardDrawn.isDrawn = true;

					if (cardDrawn.value == "King") {
						kingsCount++;
					}

					result.push(
						"@" +
							redeemUser +
							" You have drawn the " +
							cardDrawn.value +
							" of " +
							cardDrawn.suit
					);

					if (kingsCount != 4) {
						result.push(
							"Rule: " + cardDrawn.rule + " || " + cardDrawn.explanation
						);

						switch (cardDrawn.value) {
							case "Queen":
								playAudio("Check out the big brain Brad");
								break;
							case "Ace":
								playAudio("The Greater Good");
								break;
						}

						if (cardDrawn.bonusJager) {
							playAudio("jager");
							result.push(
								"A wild Jagerbomb appears, Starless uses self-control. Was it effective?"
							);
						}
					} else {
						kingsCount = 0;
						playAudio("chug");

						result.push(
							"King number 4, time for Starless to chug, but not chug, because he can't chug. Pfft, can't chug."
						);
					}
				}
			}

			return result;
		},
	};
};

let versions = [
	{
		description: "Draw a card in the Kings game",
		usage: "!kings",
		usableBy: "users",
		cost: "100 Tainty Points",
		active: true,
	},
];

const kings = new TimerCommand(commandResponse, versions, cooldown);

async function resetKings() {
	let gameState = await gameBuilder.getGameState();
	restoreGameState(gameState);
}

function getCardsToDraw() {
	return cardsToDraw;
}

function getCardsToDrawLength() {
	return cardsToDraw.length;
}

async function playAudio(audioName) {
	if (!helper.isTest()) {
		let audioLink = await AudioLink.findOne({
			name: audioName,
		});

		audio.play(audioLink.url);
	}
}

function restoreGameState(gameState) {
	cardsToDraw = gameState.cardsToDraw;
	kingsCount = gameState.kingsCount;
}

exports.command = kings;
exports.resetKings = resetKings;
exports.getCardsToDraw = getCardsToDraw;
exports.getCardsToDrawLength = getCardsToDrawLength;
