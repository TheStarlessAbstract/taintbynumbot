const CommandNew = require("../../../models/commandnew.js");
const BaseCommand = require("../../../../classes/base-command.js");
const { isNonEmptyMap, isNonEmptyString } = require("../../../utils");

jest.mock("../../../models/commandnew.js", () => ({
	findOne: jest.fn(),
}));

jest.mock("../../../utils", () => ({
	isNonEmptyString: jest.fn(),
	isNonEmptyMap: jest.fn(),
}));

describe("checkChannel()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should retrieve an existing channel object when provided with a valid channelId", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelObject = {
			output: new Map([["outputKey", "outputValue"]]),
			versions: new Map([["versionKey", "versionValue"]]),
		};
		const config = {
			channelId: "validChannelId",
			chatName: "validChatName",
		};

		isNonEmptyString.mockReturnValue(true);
		jest.spyOn(testCommand, "getChannel").mockReturnValue(channelObject);
		isNonEmptyMap.mockReturnValue(false);
		jest.spyOn(testCommand, "addChannel").mockReturnValue(false);

		// Act
		const result = await testCommand.checkChannel(config);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(testCommand.getChannel).toHaveBeenCalled();
		expect(CommandNew.findOne).not.toHaveBeenCalled();
		expect(isNonEmptyMap).not.toHaveBeenCalled();
		expect(testCommand.addChannel).not.toHaveBeenCalled();
		expect(result).toEqual(channelObject);
	});

	test("should query the database and add a new channel object to the channels object when the channel does not exist", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "validChannelId";
		const chatName = "validChatName";
		const channelObject = {
			output: new Map([["outputKey", "outputValue"]]),
			versions: new Map([["versionKey", "versionValue"]]),
		};
		const config = {
			channelId: channelId,
			chatName: chatName,
		};
		const commandObject = {
			output: new Map([["outputKey", "outputValue"]]),
			versions: new Map([["versionKey", "versionValue"]]),
		};

		isNonEmptyString.mockReturnValue(true);
		jest.spyOn(testCommand, "getChannel").mockReturnValue(null);
		CommandNew.findOne.mockResolvedValue(commandObject);
		isNonEmptyMap.mockReturnValue(true);
		jest.spyOn(testCommand, "addChannel").mockReturnValue(true);

		// Act
		const result = await testCommand.checkChannel(config);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(testCommand.getChannel).toHaveBeenCalled();
		expect(CommandNew.findOne).toHaveBeenCalledWith(
			{ channelId: channelId, chatName: chatName },
			{ output: 1, versions: 1 }
		);
		expect(isNonEmptyMap).toHaveBeenCalledTimes(2);
		expect(testCommand.addChannel).toHaveBeenCalledWith(
			channelId,
			channelObject
		);
		expect(result).toEqual(channelObject);
	});

	test("should return undefined when channelId is a non-empty string but chatName is an empty string", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const config = {
			channelId: "validChannelId",
			chatName: "",
		};

		isNonEmptyString.mockReturnValueOnce(true).mockReturnValueOnce(false);
		jest.spyOn(testCommand, "getChannel").mockReturnValue(null);

		// Act
		const result = await testCommand.checkChannel(config);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(testCommand.getChannel).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	test("should return undefined when the output or versions maps are not non-empty", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "validChannelId";
		const chatName = "validChatName";
		const config = {
			channelId: channelId,
			chatName: chatName,
		};
		const outputMap = new Map();
		const versionsMap = new Map([["versionKey", "versionValue"]]);
		const command = {
			output: outputMap,
			versions: versionsMap,
		};

		isNonEmptyString.mockReturnValue(true);
		jest.spyOn(testCommand, "getChannel").mockReturnValue(null);
		CommandNew.findOne.mockResolvedValue(command);
		isNonEmptyMap.mockReturnValueOnce(false).mockReturnValueOnce(true);
		jest.spyOn(testCommand, "addChannel").mockReturnValue(false);

		// Act
		const result = await testCommand.checkChannel(config);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(testCommand.getChannel).toHaveBeenCalledWith(channelId);
		expect(CommandNew.findOne).toHaveBeenCalledWith(
			{ channelId, chatName },
			{ output: 1, versions: 1 }
		);
		expect(isNonEmptyMap).toHaveBeenCalledWith(outputMap);
		expect(isNonEmptyMap).not.toHaveBeenCalledTimes(2);
		expect(testCommand.addChannel).not.toHaveBeenCalledWith(channelId, command);
		expect(result).toBeUndefined();
	});

	test("should return undefined when the channel object cannot be added to the channels object", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "validChannelId";
		const chatName = "validChatName";
		const config = {
			channelId: channelId,
			chatName: chatName,
		};
		const outputMap = new Map([["outputKey", "outputValue"]]);
		const versionsMap = new Map([["versionKey", "versionValue"]]);
		const command = {
			output: outputMap,
			versions: versionsMap,
		};

		isNonEmptyString.mockReturnValue(true);
		jest.spyOn(testCommand, "getChannel").mockReturnValue(null);
		CommandNew.findOne.mockResolvedValue(command);
		isNonEmptyMap.mockResolvedValue(true);
		jest.spyOn(testCommand, "addChannel").mockReturnValue(false);

		// Act
		const result = await testCommand.checkChannel(config);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(testCommand.getChannel).toHaveBeenCalledWith(channelId);
		expect(CommandNew.findOne).toHaveBeenCalledWith(
			{ channelId, chatName },
			{ output: 1, versions: 1 }
		);
		expect(isNonEmptyMap).toHaveBeenCalledTimes(2);
		expect(testCommand.addChannel).toHaveBeenCalledWith(channelId, command);
		expect(result).toBeUndefined();
	});

	test("should return undefined when the command object cannot be found in the database", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "validChannelId";
		const chatName = "validChatName";
		const config = {
			channelId: channelId,
			chatName: chatName,
		};

		isNonEmptyString.mockReturnValue(true);
		jest.spyOn(testCommand, "getChannel").mockReturnValue(null);
		CommandNew.findOne.mockResolvedValue(null);
		isNonEmptyMap.mockReturnValue(false);

		// Act
		const result = await testCommand.checkChannel(config);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(testCommand.getChannel).toHaveBeenCalledWith(channelId);
		expect(CommandNew.findOne).toHaveBeenCalledWith(
			{ channelId, chatName },
			{ output: 1, versions: 1 }
		);
		expect(isNonEmptyMap).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});
});
