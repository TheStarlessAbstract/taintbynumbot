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
jest.mock("../../../config/commandActions"); // imported and mocked to prevent fail
jest.mock("../../../classes/channel");
jest.mock("../../../classes/cardGame");
jest.mock("../../../classes/commands/cardGameNew/class");

let mockChannel;
let mockCommand;
let mockGame;
let action;

describe("draw a card", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockChannel = new Channel();
		mockCommand = new CardGameCommand();
		mockGame = new CardGame();
		mockCommand.channelId = "12345678";
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
		expect(getStreamByUserId).not.toHaveBeenCalled();
	});

	// test id 3
	test("should return undefined if config.versionKey is undefined", async () => {
		// Assemble
		const config = { versionKey: undefined };

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).not.toHaveBeenCalled();
	});

	// test id 3
	test("should return undefined if config.versionKey is incorrect", async () => {
		// Assemble
		const config = { versionKey: "wrongKey" };

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).not.toHaveBeenCalled();
	});

	// test id 4
	test("should return noStream output if no stream found", async () => {
		// Assemble
		const config = { versionKey: "drawACard" };

		getStreamByUserId.mockResolvedValue(null);

		jest
			.spyOn(mockCommand, "getOutput")
			.mockImplementation(
				() =>
					"@{displayName} - {channelName} doesn't seem to be streaming right now"
			);
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
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
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
	});

	// test id 5
	test("should return notPermitted output if config does not have permitted", async () => {
		// Assemble
		const config = { versionKey: "drawACard" };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCommand, "getOutput")
			.mockImplementation(
				() => "@{displayName} - You are not permitted to use this command"
			);
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
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
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
	});

	// test id 6
	test("should return notPermitted output if config.permitted is not boolean", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: "card" };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCommand, "getOutput")
			.mockImplementation(
				() => "@{displayName} - You are not permitted to use this command"
			);
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
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
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
	});

	// test id 7
	test("should return notPermitted output if config.permitted is false", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: false };
		getStreamByUserId.mockResolvedValue({ id: "100612361" });

		jest
			.spyOn(mockCommand, "getOutput")
			.mockImplementation(
				() => "@{displayName} - You are not permitted to use this command"
			);
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
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
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).not.toHaveBeenCalled();
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
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutput).not.toHaveBeenCalled();
		expect(mockCommand.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).not.toHaveBeenCalled();
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
			.spyOn(mockCommand, "getOutput")
			.mockImplementation(() => "@{displayName} - No game found");
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
			.mockImplementation(() => "@TaintByNumBot - No game found");

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBe("@TaintByNumBot - No game found");
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(1);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).not.toHaveBeenCalled();
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
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).not.toHaveBeenCalled();
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
		mockGame.drawCard.mockReturnValue(undefined);
		jest.spyOn(mockCommand, "validateCard").mockReturnValue(false);

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalled();
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
			.spyOn(mockCommand, "getOutput")
			.mockImplementationOnce(
				() => "@{displayName} You have drawn the {value} of {suit}"
			);
		jest
			.spyOn(mockCommand, "getOutput")
			.mockImplementationOnce(() => "Rule: {rule} || {explanation}");
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);

		// Act
		const result = await action(config);

		// Assert
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(2);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(2);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(1);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
	});

	// test id 13
	test("should return card, rule, and bonus output if valid drawn card has abonus", async () => {
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
			.spyOn(mockCommand, "getOutput")
			.mockImplementationOnce(
				() => "@{displayName} You have drawn the {value} of {suit}"
			);
		jest
			.spyOn(mockCommand, "getOutput")
			.mockImplementationOnce(() => "Rule: {rule} || {explanation}");
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
			.mockImplementationOnce(
				() => "@TaintByNumBot You have drawn the Jack of Clubs"
			);
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
			.mockImplementationOnce(
				() => "Rule: This card doesn't really have a rule || Hydrate you fools"
			);

		// Act
		const result = await action(config);

		// Assert
		expect(result[0]).toBe("@TaintByNumBot You have drawn the Jack of Clubs");
		expect(result[1]).toBe(
			"Rule: This card doesn't really have a rule || Hydrate you fools"
		);
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(0);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(0);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.validateCard).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutput).toHaveBeenCalledTimes(2);
		expect(mockCommand.getProcessedOutputString).toHaveBeenCalledTimes(2);
		expect(mockCommand.getAudioUrl).toHaveBeenCalledTimes(1);
		expect(loyaltyPoints.findOne).toHaveBeenCalledTimes(1);
	});

	test("should return undefined if drawn is does not have card property", async () => {
		// Assemble
		const config = { versionKey: "drawACard", permitted: true };

		getStreamByUserId.mockResolvedValue({ id: "100612361" });
		getChannel.mockReturnValue(mockChannel);
		mockChannel.getCardGame.mockReturnValue();
		mockGame.drawCard.mockReturnValue({ bonus: false, reset: [] });

		// Act
		const result = await action(config);

		// Assert
		expect(result).toBeUndefined();
		expect(getStreamByUserId).toHaveBeenCalledTimes(1);
		expect(mockCommand.getOutput).not.toHaveBeenCalled();
		expect(mockCommand.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test.skip("USE FOR DATABASE CHECK", async () => {
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
		expect(mockCommand.getOutput).not.toHaveBeenCalled();
		expect(mockCommand.getProcessedOutputString).not.toHaveBeenCalled();
		expect(getChannel).toHaveBeenCalledTimes(1);
		expect(mockChannel.getCardGame).toHaveBeenCalledTimes(1);
		expect(findOne).toHaveBeenCalledTimes(1);
		expect(CardGame).toHaveBeenCalledTimes(2);
		expect(mockChannel.addCardGame).toHaveBeenCalledTimes(1);
		expect(mockGame.drawCard).toHaveBeenCalledTimes(1);
	});

	test.skip("test", async () => {
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
			.spyOn(mockCommand, "getOutput")
			.mockImplementationOnce(() => "Queen of Hearts")
			.mockImplementationOnce(() => "Ask a question");
		jest
			.spyOn(mockCommand, "getProcessedOutputString")
			.mockImplementationOnce(() => "Queen of Hearts")
			.mockImplementationOnce(() => "Ask a question");
		jest
			.spyOn(mockCommand, "getAudioUrl")
			.mockImplementation(() => "https://www.youtube.com/watch?v=ybGOT4d2Hs8");

		loyaltyPoints.findOne.mockResolvedValue(undefined);

		// Act
		const result = await action(config);

		// Assert
		expect(result[0]).toBe("Queen of Hearts");
		expect(result[1]).toBe("Ask a question");
	});
});
