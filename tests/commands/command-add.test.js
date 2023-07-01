require("dotenv").config();

const db = require("../../bot-mongoose.js");
const BaseCommand = require("../../classes/base-command");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandAdd = require("../../commands/command-add");

let userInfo = {};
let argument;
let commandLink = commandAdd.command;
const { response } = commandLink.getCommand();

let commandName;
let commandText;

describe.skip("addComm", () => {
	let commandNames = [];

	beforeAll(async () => {
		db.connectToMongoDB();
		await commands.setup();
	});

	afterAll(async () => {
		await dBCleanUp(commandNames);
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!addComm is for Mods only");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command use !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest3";
		argument = commandName;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasNoCommandName_ShouldReturnString", async () => {
		//Assemble
		argument = "!";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command name - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest5";
		argument = "!" + commandName;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command text - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest6";
		commandText = "this is addCommTest6";
		argument = "!" + commandName + " " + commandText;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest6 has been created!");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest7";
		commandText = "this is addCommTest7";
		argument = "!" + commandName + " " + commandText;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest7 already exists");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command use !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest9";
		commandText = "this is addCommTest9";
		argument = commandName + " " + commandText;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasNoCommandName_ShouldReturnString", async () => {
		//Assemble
		argument = "!";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command name - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest11";
		argument = "!" + commandName;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command text - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest12";
		commandText = "this is addCommTest12";
		argument = "!" + commandName + " " + commandText;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest12 has been created!");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "addCommTest13";
		commandText = "this is addCommTest13";
		argument = "!" + commandName + " " + commandText;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest13 already exists");
	});
});

async function dbSetup(setupCommand, text) {
	setupCommand = setupCommand.toLowerCase();
	commands.list[setupCommand] = new BaseCommand(() => {
		return {
			response: text,
		};
	});

	await Command.create({ name: setupCommand, text: text });
}

async function dBCleanUp(cleanUpCommands) {
	cleanUpCommands = cleanUpCommands.map((name) => name.toLowerCase());

	cleanUpCommands.forEach((name) => {
		delete commands.list[name];
	});

	await Command.deleteMany({ name: { $in: cleanUpCommands } });
}
