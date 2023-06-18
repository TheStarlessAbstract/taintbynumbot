require("dotenv").config();

const db = require("../../bot-mongoose.js");
const BaseCommand = require("../../classes/base-command");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandAdd = require("../../commands/command-add");

let isBroadcaster;
let isMod;
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

	test("IsBroadcasterFalse_AndAndIsModFalse_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!addComm is for Mods only");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command use !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest3";
		argument = commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasNoCommandName_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "!";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command name - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest5";

		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command text - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest6";
		commandText = "this is addCommTest6";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest6 has been created!");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest7";
		commandText = "this is addCommTest7";
		argument = "!" + commandName + " " + commandText;

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest7 already exists");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command use !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest9";
		commandText = "this is addCommTest9";
		argument = commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasNoCommandName_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "!";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command name - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest11";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"To add a Command, you must include the command text - !addComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest12";
		commandText = "this is addCommTest12";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe("!addcommtest12 has been created!");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest13";
		commandText = "this is addCommTest13";
		argument = "!" + commandName + " " + commandText;

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
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
