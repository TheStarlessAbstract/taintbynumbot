require("dotenv").config();

const db = require("../../bot-mongoose.js");
const kings = require("../../commands/kings");
const LoyaltyPoint = require("../../models/loyaltypoint");

let userInfo;
let commandLink = kings.command;
const { response } = commandLink.getCommand();
let currentDateTime = new Date();
let user;

describe("kings", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await kings.resetKings();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndCoolDownIsNotElapsed_ShouldReturnUndefined", async () => {
		//Assemble
		userInfo = { isBroadcaster: false };
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndCoolDownIsElapsed_AndUserNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo = { isBroadcaster: false, userId: 12826, displayName: "Twitch" };
		commandLink.setTimer(currentDateTime - 6000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toMatch(/@Twitch I hate to say it/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownIsElapsed_AndUserInDatabase_AndUsersBalanceNotEnough_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
			userId: 56815563,
			displayName: "intelrush",
		};
		commandLink.setTimer(currentDateTime - 6000);

		user = await LoyaltyPoint.findOne({
			userId: userInfo.userId,
		});

		user.points = 0;
		await user.save();

		//Act
		let result = await response({
			userInfo,
		});

		user.points = 69000;
		await user.save();

		//Assert
		expect(result[0]).toMatch(/You lack the points to draw a card/);
	});

	test("IsBroadcasterIsFalse_AndCoolDownIsElapsed_AndUserInDatabase_AndUsersBalanceEnough_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: false,
			userId: 56815563,
			displayName: "intelrush",
		};
		commandLink.setTimer(currentDateTime - 6000);

		user = await LoyaltyPoint.findOne({
			userId: userInfo.userId,
		});

		user.points = 69000;
		await user.save();

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toMatch(/You have drawn the/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownIsNotElapsed_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 1000);

		//Act
		let result = await response({
			userInfo,
		});

		//Assert
		expect(result[0]).toMatch(/You have drawn the/);
	});

	test("IsBroadcasterIsTrue_AndCoolDownIsElapsed_ShouldReturnString", async () => {
		//Assemble
		userInfo = {
			isBroadcaster: true,
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
		commandLink.setTimer(currentDateTime - 6000);

		user.points = 0;
		await user.save();

		//Act
		let result = await response({
			userInfo,
		});

		user.points = 69000;
		await user.save();

		//Assert
		expect(result[0]).toMatch(/You have drawn the/);
	});

	test("draw all cards", async () => {
		//Assemble
		userInfo = { isBroadcaster: true, displayName: "TheStarlessAbstract" };
		commandLink.setTimer(currentDateTime - 1000);
		await kings.resetKings();

		//Act
		let result;
		let value;
		let suit;
		let drawn = [];
		let decks = 4;
		for (let i = 0; i < 52 * decks; i++) {
			result = await response({
				userInfo,
			});

			value = result[0].split(" ")[5];

			suit = result[0].split(" ")[7];
			drawn.push({ value: value, suit: suit });
		}

		let cardTotals = checkDrawn(drawn);

		//Assert
		expect(cardTotals.clubs).toBe(13 * decks);
		expect(cardTotals.diamonds).toBe(13 * decks);
		expect(cardTotals.hearts).toBe(13 * decks);
		expect(cardTotals.spades).toBe(13 * decks);
		expect(cardTotals.two).toBe(4 * decks);
		expect(cardTotals.three).toBe(4 * decks);
		expect(cardTotals.four).toBe(4 * decks);
		expect(cardTotals.five).toBe(4 * decks);
		expect(cardTotals.six).toBe(4 * decks);
		expect(cardTotals.seven).toBe(4 * decks);
		expect(cardTotals.eight).toBe(4 * decks);
		expect(cardTotals.nine).toBe(4 * decks);
		expect(cardTotals.ten).toBe(4 * decks);
		expect(cardTotals.jack).toBe(4 * decks);
		expect(cardTotals.queen).toBe(4 * decks);
		expect(cardTotals.king).toBe(4 * decks);
		expect(cardTotals.ace).toBe(4 * decks);
	});
});

function checkDrawn(drawn) {
	let cards = {
		clubs: 0,
		diamonds: 0,
		hearts: 0,
		spades: 0,
		two: 0,
		three: 0,
		four: 0,
		five: 0,
		six: 0,
		seven: 0,
		eight: 0,
		nine: 0,
		ten: 0,
		jack: 0,
		queen: 0,
		king: 0,
		ace: 0,
	};

	drawn.forEach((card) => {
		switch (card.suit) {
			case "Clubs":
				cards.clubs++;
				break;
			case "Diamonds":
				cards.diamonds++;
				break;
			case "Hearts":
				cards.hearts++;
				break;
			case "Spades":
				cards.spades++;
				break;
		}

		switch (card.value) {
			case "2":
				cards.two++;
				break;
			case "3":
				cards.three++;
				break;
			case "4":
				cards.four++;
				break;
			case "5":
				cards.five++;
				break;
			case "6":
				cards.six++;
				break;
			case "7":
				cards.seven++;
				break;
			case "8":
				cards.eight++;
				break;
			case "9":
				cards.nine++;
				break;
			case "10":
				cards.ten++;
				break;
			case "Jack":
				cards.jack++;
				break;
			case "Queen":
				cards.queen++;
				break;
			case "King":
				cards.king++;
				break;
			case "Ace":
				cards.ace++;
				break;
		}
	});

	return cards;
}
