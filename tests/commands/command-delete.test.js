require("dotenv").config();

const db = require("../../bot-mongoose.js");
const BaseCommand = require("../../classes/base-command");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandDelete = require("../../commands/command-delete");

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
		expect(result[0]).toBe("!delComm Command is for Mods only");
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
		expect(result[0]).toBe("To delete a Command, use !delComm ![command name]");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		commandName = "delCommTest3";
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

		//Assert
		expect(result[0]).toBe(
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
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
			"To delete a Command, you must include the command name - !delComm ![command name]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "delCommTest5";
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

		//Assert
		expect(result[0]).toBe(
			"!delcommtest5 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandNotDeletable_ShouldReturnString", async () => {
		//Assemble
		commandName = "kings";
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

		//Assert
		expect(result[0]).toBe(
			"!kings is too spicy to be deleted through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandIsDeletable_ShouldReturnString", async () => {
		//Assemble
		commandName = "delCommTest7";
		commandText = "this is delCommTest7";
		argument = "!" + commandName;
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
		expect(result[0]).toBe("!delcommtest7 has been deleted");
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
		expect(result[0]).toBe("To delete a Command, use !delComm ![command name]");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		commandName = "delCommTest11";
		argument = commandName;
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
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
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
			"To delete a Command, you must include the command name - !delComm ![command name]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "delCommTest11";
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

		//Assert
		expect(result[0]).toBe(
			"!delcommtest11 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandNotDeletable_ShouldReturnString", async () => {
		//Assemble
		commandName = "kings";
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

		//Assert
		expect(result[0]).toBe(
			"!kings is too spicy to be deleted through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndCommandInCommandList_AndCommandIsDeletable_ShouldReturnString", async () => {
		//Assemble
		commandName = "delCommTest13";
		commandText = "this is delCommTest13";
		argument = "!" + commandName;
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
