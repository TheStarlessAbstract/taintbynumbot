require("dotenv").config();

const db = require("../../bot-mongoose.js");
const BaseCommand = require("../../classes/base-command");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandDelete = require("../../commands/command-delete");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument;
let commandLink = commandDelete.command;
const { response } = commandLink.getCommand();

let commandName;
let commandText;

describe("delComm", () => {
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
		expect(result[0]).toBe("!delComm Command is for Mods only");
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toBe("To delete a Command, use !delComm ![command name]");
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest3";
		argument = commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
		);
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasNoCommandName_ShouldReturnString", async () => {
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
			"To delete a Command, you must include the command name - !delComm ![command name]"
		);
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest5";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delcommtest5 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandNotDeletable_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "kings";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!kings is too spicy to be deleted through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandIsDeletable_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest7";
		commandText = "this is delCommTest7";
		argument = "!" + commandName;

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
		expect(result[0]).toBe("!delcommtest7 has been deleted");
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
		expect(result[0]).toBe("To delete a Command, use !delComm ![command name]");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest11";
		argument = commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
		);
	});

	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasNoCommandName_ShouldReturnString", async () => {
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
			"To delete a Command, you must include the command name - !delComm ![command name]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest11";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delcommtest11 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandNotDeletable_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "kings";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!kings is too spicy to be deleted through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandIsDeletable_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest13";
		commandText = "this is delCommTest13";
		argument = "!" + commandName;

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
		expect(result[0]).toBe("!delcommtest13 has been deleted");
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
