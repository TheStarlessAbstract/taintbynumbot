const drawACardAction = require("../../../classes/commands/cardGameNew/drawACard");
const CardGameCommand = require("../../../classes/commands/cardGameNew/class");
const { getStreamByUserId } = require("../../../services/twitch/streams");
const { getChannel } = require("../../../controllers/channels");
const Channel = require("../../../classes/channel");
const CardGame = require("../../../classes/cardGame");
const commandActions = require("../../../config/commandActions");
const loyaltyPoints = require("../../../queries/loyaltyPoints");
const { findOne } = require("../../../queries/cardGames");

jest.mock("../../../services/twitch/streams", () => ({
	getStreamByUserId: jest.fn(),
}));
jest.mock("../../../controllers/channels", () => ({
	getChannel: jest.fn(),
}));
jest.mock("../../../queries/cardGames", () => ({
	findOne: jest.fn(),
}));
jest.mock("../../../queries/loyaltyPoints");
jest.mock("../../../config/commandActions");
jest.mock("../../../classes/channel");
jest.mock("../../../classes/cardGame");
jest.mock("../../../classes/commands/cardGameNew/class");

let mockChannel;
let mockCardGame;
let mockGame;
let action;

describe("draw a card", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockChannel = new Channel();
		mockCardGame = new CardGameCommand();
		mockGame = new CardGame();
		action = drawACardAction.bind(mockCardGame);
	});

	test("when versionKey is not drawACard - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "hydrate" };

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).not.toHaveBeenCalled();
	});

	test("when versionKey is drawACard, and getStreamByUserId returns null - should return noStream string", async () => {
		// Assemble
		const config = { versionKey: "drawACard" };
		getStreamByUserId.mockResolvedValue(null);

		jest
			.spyOn(mockCardGame, "getOutput")
			.mockImplementation(
				() =>
					"@{displayName} - {channelName} doesn't seem to be streaming right now"
			);
		jest
			.spyOn(mockCardGame, "getProcessedOutputString")
			.mockImplementation(
				() =>
					"@TaintByNumBot - TheStarlessAbstract doesn't seem to be streaming right now"
			);
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe(
			"@TaintByNumBot - TheStarlessAbstract doesn't seem to be streaming right now"
		);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, and config.permitted is false - should return notPermitted string", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: false };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCardGame, "getOutput")
			.mockImplementation(
				() => "@{displayName} - You are not permitted to use this command"
			);
		jest
			.spyOn(mockCardGame, "getProcessedOutputString")
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
		expect(mockCardGame.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, and config does not have permitted property - should return notPermitted string", async () => {
		// Assemble
		const config = { versionKey: "drawACard" };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCardGame, "getOutput")
			.mockImplementation(
				() => "@{displayName} - You are not permitted to use this command"
			);
		jest
			.spyOn(mockCardGame, "getProcessedOutputString")
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
		expect(mockCardGame.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, and getChannel does not return a Channel - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue({});
		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).not.toHaveBeenCalled();
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does not return an object  - should return noGame string", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCardGame, "getOutput")
			.mockImplementation(() => "@{displayName} - No game found");
		jest
			.spyOn(mockCardGame, "getProcessedOutputString")
			.mockImplementation(() => "@TaintByNumBot - No game found");

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});
		findOne.mockResolvedValue(undefined);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe("@TaintByNumBot - No game found");
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).not.toHaveBeenCalled();
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, and CardGame.drawCard doesn't return an object - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		mockGame.drawCard.mockReturnValue();
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns an object, and object does not have card property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		mockGame.drawCard.mockReturnValue({ bonus: false, reset: [] });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns an object, and object does not have reset property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "Hydrate",
			explanation: "Hydrate you little bitch",
		};

		mockGame.drawCard.mockReturnValue({ card, bonus: false });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns an object, and object does not have bonus property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "Hydrate",
			explanation: "Hydrate you little bitch",
		};

		mockGame.drawCard.mockReturnValue({ card, reset: false });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns a valid object, and card does not have suit property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		card = {
			value: "Jack",
			rule: "Hydrate",
			explanation: "Hydrate you little bitch",
		};

		mockGame.drawCard.mockReturnValue({ card, reset: false });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns a valid object, and card does not have value property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		card = {
			suit: "Clubs",
			rule: "Hydrate",
			explanation: "Hydrate you little bitch",
		};

		mockGame.drawCard.mockReturnValue({ card, reset: false });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns a valid object, and card does not have rule property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		card = {
			suit: "Clubs",
			value: "Jack",
			explanation: "Hydrate you little bitch",
		};

		mockGame.drawCard.mockReturnValue({ card, reset: false });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("when versionKey is drawACard, getStreamByUserId returns an object, config.permitted is true, getChannel returns a Channel, Channel.getCardGame does not return a CardGame, and findOne does return an object, CardGame.drawCard returns a valid object, and card does not have explanation property - should return undefined", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue({});

		findOne.mockResolvedValue({
			channelId: "123",
			name: "Kings",
			suits: ["Clubs", "Diamonds", "Hearts", "Spades"],
			values: [1, 2, 3],
			bonus: [{ 1: "jager", 2: "lastKing" }],
		});

		card = {
			suit: "Clubs",
			value: "Jack",
			rule: "Hydrate",
		};

		mockGame.drawCard.mockReturnValue({ card, reset: false });
		CardGame.mockReturnValue(mockGame);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCardGame.getOutput).not.toHaveBeenCalled();
		expect(mockCardGame.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test("test", async () => {
		// Assemble
		const config = {
			channelId: "100612361",
			userId: "100612361",
			username: "thestarlessabstract",
			chatName: "kings",
			versionKey: "drawACard",
			user: {
				channelId: "100612361",
				viewerId: "100612361",
				points: 1200,
				follower: false,
				__v: 0,
			},
			permitted: true,
			bypass: true,
			userCanPayCost: true,
			configMap: new Map([
				["channelName", "thestarlessabstract"],
				["displayName", "TheStarlessAbstract"],
				["gameName", undefined],
				["channelId", "100612361"],
				["isBroadcaster", true],
			]),
		};

		getStreamByUserId.mockResolvedValue({ stream: true });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue(mockGame);

		const testCard = {
			suit: 1,
			value: 1,
			rule: 1,
			explanation: 1,
		};

		mockGame.drawCard.mockReturnValue({
			card: testCard,
			reset: false,
			bonus: [],
		});

		jest
			.spyOn(mockCardGame, "getOutput")
			.mockImplementationOnce(() => "Queen of Hearts")
			.mockImplementationOnce(() => "Ask a question");
		jest
			.spyOn(mockCardGame, "getProcessedOutputString")
			.mockImplementationOnce(() => "Queen of Hearts")
			.mockImplementationOnce(() => "Ask a question");
		jest
			.spyOn(mockCardGame, "getAudioUrl")
			.mockImplementation(() => "https://www.youtube.com/watch?v=ybGOT4d2Hs8");

		loyaltyPoints.findOne.mockResolvedValue(undefined);

		// Act
		const result = await action(config);

		// Assert
		expect(result[0]).toBe("Queen of Hearts");
		expect(result[1]).toBe("Ask a question");
	});
});
