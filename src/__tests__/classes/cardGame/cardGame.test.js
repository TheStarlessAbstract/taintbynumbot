const drawACardAction = require("../../../classes/commands/cardGameNew/drawACard");
const CardGameCommand = require("../../../classes/commands/cardGameNew/class");
const { getStreamByUserId } = require("../../../services/twitch/streams");
const { getChannel } = require("../../../controllers/channels");
const Channel = require("../../../classes/channel");
const CardGame = require("../../../classes/cardGame");
const CardGameBonus = require("../../../classes/cardGameBonus");
const commandActions = require("../../../config/commandActions");
const loyaltyPoints = require("../../../queries/loyaltyPoints");
const LoyaltyPoints = require("../../../models/loyaltypointnew");
const { findOne } = require("../../../queries/cardGames");
const { play } = require("../../../services/audio");

jest.mock("../../../services/twitch/streams", () => ({
	getStreamByUserId: jest.fn(),
}));
jest.mock("../../../controllers/channels", () => ({
	getChannel: jest.fn(),
}));
jest.mock("../../../queries/cardGames", () => ({
	findOne: jest.fn(),
}));
jest.mock("../../../services/audio", () => ({
	play: jest.fn(),
}));
jest.mock("../../../queries/loyaltyPoints");
jest.mock("../../../config/commandActions"); // imported and mocked to prevent fail
jest.mock("../../../classes/channel");
jest.mock("../../../classes/cardGame");
jest.mock("../../../classes/cardGameBonus");
jest.mock("../../../classes/commands/cardGameNew/class");
jest.mock("../../../models/loyaltypointnew");

let mockChannel;
let mockCommand;
let mockGame;
let mockGameBonus;
let mockUser;
let action;

describe("draw a card", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockChannel = new Channel();
		mockCommand = new CardGameCommand();
		mockGame = new CardGame();
		mockGameBonus = new CardGameBonus();
		mockUser = new LoyaltyPoints();
		mockCommand.channelId = "100612361";
		action = drawACardAction.bind(mockCommand);
	});

	// test id 1
	test("should return undefined if config does not have versionKey", async () => {
		// Assemble
		const config = {};

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();

		expect(getStreamByUserId).toHaveBeenCalledTimes(0);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 2
	test("should return undefined if config.versionKey is undefined", async () => {
		// Assemble
		const config = { versionKey: undefined };

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();

		expect(getStreamByUserId).toHaveBeenCalledTimes(0);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 3
	test("should return undefined if config.versionKey is incorrect", async () => {
		// Assemble
		const config = { versionKey: "wrongKey" };

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();

		expect(getStreamByUserId).toHaveBeenCalledTimes(0);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 4
	test("should return noStream output if no stream found", async () => {
		// Assemble
		const config = { versionKey: "drawACard" };

		getStreamByUserId.mockResolvedValue(null);

		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() =>
					"@TaintByNumBot - TheStarlessAbstract doesn't seem to be streaming right now"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(result).toBe(
			"@TaintByNumBot - TheStarlessAbstract doesn't seem to be streaming right now"
		);

		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 5
	test("should return notPermitted output if config does not have permitted", async () => {
		// Assemble
		const config = { versionKey: "drawACard" };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - You are not permitted to use this command"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - You are not permitted to use this command"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 6
	test("should return notPermitted output if config.permitted is not boolean", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: "card" };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - You are not permitted to use this command"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - You are not permitted to use this command"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 7
	test("should return notPermitted output if config.permitted is false", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: false };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(
				() => "@TaintByNumBot - You are not permitted to use this command"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - You are not permitted to use this command"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 8
	test("should return undefined if channel is not an instance of Channel", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(undefined);

		// Act
		const result = await action(config);

		// Assert
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(result).toBeUndefined();

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(0);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(0);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 9
	test("should return noGame output if no card game found in channel and database", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});
		findOne.mockResolvedValue(undefined);

		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementation(() => "@TaintByNumBot - No game found");

		// Act
		const result = await action(config);

		// Assert
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(result).toBe("@TaintByNumBot - No game found");

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 10
	test("should return undefined if drawn card is invalid - card game from channel", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);
		mockGame.drawCard.mockReturnValue(undefined);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(false);

		// Act
		const result = await action(config);

		// Assert
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(result).toBeUndefined();

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(0);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 11
	test("should return undefined if drawn card is invalid - card game from database", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});
		findOne.mockResolvedValue({
			channelId: "100612361",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});
		CardGame.mockReturnValue(mockGame);
		mockGame.drawCard.mockResolvedValue(undefined);
		jest.spyOn(mockCommand, "validateCard").mockReturnValue(false);

		// Act
		const result = await action(config);

		// Assert
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(result).toBeUndefined();

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(0);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(0);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 12
	test("should return card and rule output if drawn card is valid", async () => {
		// Assemble
		const config = {
			versionKey: "drawACard",
			permitted: true,
			configMap: new Map(),
		};
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		};

		mockGame.drawCard.mockReturnValue({ card, reset: false, bonus: [] });
		loyaltyPoints.findOne.mockResolvedValue(undefined);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);

		// Act
		const result = await action(config);

		// Assert
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(2);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 13
	test("should call play() with an array of URLs, card has audiolink", async () => {
		// Assemble
		const config = {
			versionKey: "drawACard",
			permitted: true,
			configMap: new Map(),
		};
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
			audioName: ["hydrate"],
		};

		mockGame.drawCard.mockReturnValue({
			card,
			reset: false,
			bonus: [],
		});

		loyaltyPoints.findOne.mockResolvedValue(undefined);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);
		jest
			.spyOn(mockCommand, "getAudioUrl")
			.mockResolvedValue("https://some.audio.link/hydrate.mp3");

		// Act
		const result = await action(config);

		// Assert
		expect(play).toHaveBeenCalledWith("100612361", [
			"https://some.audio.link/hydrate.mp3",
		]);
		expect(play).toHaveBeenCalledTimes(1);
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(2);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(1);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
		expect(mockUser.save).toHaveBeenCalledTimes(0);
	});

	// test id 14
	test("should return card, rule, and bonus output if valid drawn card has a bonus", async () => {
		// Assemble
		const config = {
			versionKey: "drawACard",
			permitted: true,
			configMap: new Map(),
		};
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		};

		mockGame.drawCard.mockReturnValue({
			card,
			reset: false,
			bonus: [{ id: 1, reward: 69, audioLink: undefined }],
		});

		mockUser.points = 1000;
		loyaltyPoints.findOne.mockResolvedValue(mockUser);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(true);

		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() =>
					"@{TaintByNumBot} - You have won 69 Tainty Points, you now have 1069"
			);

		// Act
		const result = await action(config);

		// Assert
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
		expect(mockUser.save).toHaveBeenCalledTimes(1);
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);
		expect(result[2]).toBe(
			"@{TaintByNumBot} - You have won 69 Tainty Points, you now have 1069"
		);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(3);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(play).toHaveBeenCalledTimes(0);
	});

	// test id 15
	test("should return card, rule, and bonus output if valid drawn card has a bonus has audiolink", async () => {
		// Assemble
		const config = {
			versionKey: "drawACard",
			permitted: true,
			configMap: new Map(),
		};
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
			audioName: undefined,
		};

		mockGame.drawCard.mockReturnValue({
			card,
			reset: false,
			bonus: [
				{ id: 1, reward: 69, audioLink: "https://some.audio.link/chug.mp3" },
			],
		});

		mockUser.points = 1000;
		loyaltyPoints.findOne.mockResolvedValue(mockUser);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() =>
					"@{TaintByNumBot} - You have won 69 Tainty Points, you now have 1069"
			);

		// Act
		const result = await action(config);

		// Assert
		expect(play).toHaveBeenCalledWith("100612361", [
			"https://some.audio.link/chug.mp3",
		]);
		expect(play).toHaveBeenCalledTimes(1);
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);
		expect(result[2]).toBe(
			"@{TaintByNumBot} - You have won 69 Tainty Points, you now have 1069"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(3);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
		expect(mockUser.save).toHaveBeenCalledTimes(1);
	});

	// test id 16
	test("should return card, rule, and reset output if final card has been drawn", async () => {
		// Assemble
		const config = {
			versionKey: "drawACard",
			permitted: true,
			configMap: new Map(),
		};
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
		};

		mockGame.drawCard.mockReturnValue({
			card,
			reset: true,
			bonus: [],
		});

		mockUser.points = 1000;
		loyaltyPoints.findOne.mockResolvedValue(mockUser);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(true);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(() => "New game has been dealt");

		// Act
		const result = await action(config);

		// Assert
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);
		expect(result[2]).toBe("New game has been dealt");

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(3);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(0);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
		expect(mockUser.save).toHaveBeenCalledTimes(1);
	});

	// test id 15
	test("should call play() with an array of two URLs, card and bonus have audiolink", async () => {
		// Assemble
		const config = {
			versionKey: "drawACard",
			permitted: true,
			configMap: new Map(),
		};
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "This card doesn't really have a rule",
			explanation: "Hydrate you fools",
			audioName: ["hydrate"],
		};

		mockGame.drawCard.mockReturnValue({
			card,
			reset: false,
			bonus: [
				{ id: 1, reward: 69, audioLink: "https://some.audio.link/chug.mp3" },
			],
		});

		mockUser.points = 1000;
		loyaltyPoints.findOne.mockResolvedValue(mockUser);

		jest.spyOn(mockCommand, "validateCard").mockReturnValue(true);
		jest
			.spyOn(mockCommand, "getAudioUrl")
			.mockResolvedValue("https://some.audio.link/hydrate.mp3");
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);
		jest
			.spyOn(mockCommand, "getOutputString")
			.mockImplementationOnce(
				() =>
					"@{TaintByNumBot} - You have won 69 Tainty Points, you now have 1069"
			);

		// Act
		const result = await action(config);

		// Assert
		expect(play).toHaveBeenCalledWith("100612361", [
			"https://some.audio.link/hydrate.mp3",
			"https://some.audio.link/chug.mp3",
		]);
		expect(play).toHaveBeenCalledTimes(1);
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);
		expect(result[2]).toBe(
			"@{TaintByNumBot} - You have won 69 Tainty Points, you now have 1069"
		);

		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutputString).toHaveBeenCalledTimes(3);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(1);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
		expect(mockUser.save).toHaveBeenCalledTimes(1);
	});
});
