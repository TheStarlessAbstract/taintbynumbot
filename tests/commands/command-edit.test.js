require("dotenv").config();

const db = require("../../bot-mongoose.js");
const BaseCommand = require("../../classes/base-command");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandAdd = require("../../commands/command-edit");

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
		expect(result[0]).toBe("!editComm is for Mods only");
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
			"To edit a Command, use !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest3";
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
			"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
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
			"To edit a Command, you must include the command name - !editComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest5";
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
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest6";
		editedCommandText = "6this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;
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
			"!editcommtest6 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotEditable_ShouldReturnString", async () => {
		//Assemble
		commandName = "kings";
		commandText = "this is editCommTest7";
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

		//Assert
		expect(result[0]).toBe(
			"!" +
				commandName +
				" is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest8";
		commandText = "this is editCommTest8";
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
		expect(result[0]).toBe(
			"!editcommtest8 already says: this is editCommTest8"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest9";
		commandText = "this is editCommTest9";
		editedCommandText = "9this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;
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
		expect(result[0]).toBe("!editcommtest9 has been edited!");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble=
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
			"To edit a Command, use !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNoPrefix_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest11";
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

		commandNames.push(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
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
			"To edit a Command, you must include the command name - !editComm ![command name] [command text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasNoCommandText_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest13";
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
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandNameNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest14";
		editedCommandText = "14this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;
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
			"!editcommtest14 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotEditable_ShouldReturnString", async () => {
		//Assemble
		commandName = "kings";
		editedCommandText = "15this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;
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
			"!kings is too spicy to be edited through chat, Starless is going to have to do some work for that, so ask nicely"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest16";
		commandText = "this is editCommTest16";
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
		expect(result[0]).toBe(
			"!editcommtest16 already says: this is editCommTest16"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringHasPrefix_AndStringHasCommandName_AndStringHasCommandText_AndCommandInCommandList_AndCommandNotIsEditable_AndCommandTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		commandName = "editCommTest17";
		commandText = "this is editCommTest17";
		editedCommandText = "17this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;
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
