require("dotenv").config();

const db = require("../../bot-mongoose.js");
const BaseCommand = require("../../classes/base-command");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandAdd = require("../../commands/command-edit");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument = undefined;
let commandLink = commandAdd.command;
const { response } = commandLink.getCommand();

let commandName;
let commandText;
let editedCommandText;

describe.skip("editComm", () => {
	let commandNames = [];

	beforeAll(async () => {
		db.connectToMongoDB();
		await commands.setup();
	});

	afterAll(async () => {
		await dBCleanUp(commandNames);
		await db.disconnectFromMongoDB();
	});

	test("IsBroadcasterFalse_AndIsModFalse_ShouldReturnString", async () => {
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
		expect(result[0]).toBe("!editComm is for Mods only");
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
			"To edit a Command, use !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest3";
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
			"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
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
			"To edit a Command, you must include the command name - !editComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest5";
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
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest6";
		editedCommandText = "6this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

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
			"!editcommtest6 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotEditable_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "kings";
		commandText = "this is editCommTest7";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!" +
				commandName +
				" is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest8";
		commandText = "this is editCommTest8";
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
		expect(result[0]).toBe(
			"!editcommtest8 already says: this is editCommTest8"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest9";
		commandText = "this is editCommTest9";
		editedCommandText = "9this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

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
		expect(result[0]).toBe("!editcommtest9 has been edited!");
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
			"To edit a Command, use !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest11";
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
			"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
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
			"To edit a Command, you must include the command name - !editComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest13";
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
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest14";
		editedCommandText = "14this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

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
			"!editcommtest14 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotEditable_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "kings";
		editedCommandText = "15this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!kings is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest16";
		commandText = "this is editCommTest16";
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
		expect(result[0]).toBe(
			"!editcommtest16 already says: this is editCommTest16"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest17";
		commandText = "this is editCommTest17";
		editedCommandText = "17this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

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
		expect(result[0]).toBe("!editcommtest17 has been edited!");
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
