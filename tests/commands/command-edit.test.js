require("dotenv").config();

const db = require("../../bot-mongoose.js");
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

describe("editComm", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await commands.setup();
	});

	afterAll(async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest2";
		editedCommandText = "this is 2editCommTest";
		argument = commandName + " " + editedCommandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentValid_AndNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest3";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentValid_AndCommandText_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest4";
		editedCommandText = "this is 4editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"!editcommtest4 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentValid_AndCommandText_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest5";
		commandText = "this is editCommTest5";
		editedCommandText = "this is 5editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("!editcommtest5 has been edited!");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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

	test("IsBroadcasterTrue_AndIsModFalse_ShouldReturnString", async () => {
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

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, use !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest8";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndCommandText_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest9";
		editedCommandText = "9this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"!editcommtest9 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndCommandText_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest10";
		commandText = "this is editCommTest10";
		editedCommandText = "10this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("!editcommtest10 has been edited!");
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

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest12";
		commandText = "this is editCommTest12";
		argument = commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, command name must start with '!' - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest13";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"To edit a Command, you must include the edited command text - !editComm ![command name] [edited command text]"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndCommandText_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
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

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"!editcommtest14 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndCommandText_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest15";
		commandText = "this is editCommTest15";
		editedCommandText = "15this is editCommTest";
		argument = "!" + commandName + " " + editedCommandText;

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("!editcommtest15 has been edited!");
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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
});

async function dbSetup(setupCommand, text) {
	setupCommand = setupCommand.toLowerCase();
	commands.list[setupCommand] = {
		response: text,
	};
	await Command.create({ name: setupCommand, text: text });
}

async function dBCleanUp(cleanUpCommand) {
	cleanUpCommand = cleanUpCommand.toLowerCase();
	delete commands.list[cleanUpCommand];
	await Command.deleteOne({ name: cleanUpCommand });
}
