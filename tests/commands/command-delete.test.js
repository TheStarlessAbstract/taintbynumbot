require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const delCommand = require("../../commands/command-delete");

let isBroadcaster = true;
let isModUp = true;
let userInfo = {};
let argument = undefined;
let commandLink = delCommand.command;
const { response } = commandLink.getCommand();

let commandName;
let commandText;

describe("delComm", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await commands.setup();
	});

	beforeEach(() => {
		isBroadcaster = true;
		isModUp = true;
		userInfo = {};
		argument = undefined;
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	// 0 - 0 - 0 - 0
	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "delCommTest1";
		commandText = "this is delCommTest1";
		argument = commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!delcomm command is for Mods only");
	});

	// 0 - 0 - 0 - 1
	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "delCommTest2";
		commandText = "this is delCommTest2";
		argument = commandName;

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
		expect(result[0]).toBe("!delcomm command is for Mods only");
	});

	// 0 - 0 - 1 - 0
	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest3";
		commandText = "this is delCommTest3";
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
			"To delete a command, include '!' at the start of the command to delete !delcomm ![command name]"
		);
	});

	// 0 - 0 - 1 - 1
	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest4";
		commandText = "this is delCommTest4";
		argument = commandName;

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
		expect(result[0]).toBe(
			"To delete a command, include '!' at the start of the command to delete !delcomm ![command name]"
		);
	});

	// 0 - 1 - 0 - 0
	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "delCommTest5";
		commandText = "this is delCommTest5";
		argument = commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!delcomm command is for Mods only");
	});

	// 0 - 1 - 0 - 1
	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest6";
		commandText = "this is delCommTest6";
		argument = commandName;

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
		expect(result[0]).toBe(
			"To delete a command, include '!' at the start of the command to delete !delcomm ![command name]"
		);
	});

	// 0 - 1 - 1 - 0
	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "delCommTest7";
		commandText = "this is delCommTest7";
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
			"To delete a command, include '!' at the start of the command to delete !delcomm ![command name]"
		);
	});

	// 0 - 1 - 1 - 1
	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "delCommTest8";
		commandText = "this is delCommTest8";
		argument = commandName;

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
		expect(result[0]).toBe(
			"To delete a command, include '!' at the start of the command to delete !delcomm ![command name]"
		);
	});

	// 1 - 0 - 0 - 0
	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "delCommTest9";
		commandText = "this is delCommTest9";
		argument = "!" + commandName;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!delcomm command is for Mods only");
	});

	// 1 - 0 - 0 - 1
	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "delCommTest10";
		commandText = "this is delCommTest10";
		argument = "!" + commandName;

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
		expect(result[0]).toBe("!delcomm command is for Mods only");
	});

	// 1 - 0 - 1 - 0
	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest11";
		commandText = "this is delCommTest11";
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

	// 1 - 0 - 1 - 1
	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest12";
		commandText = "this is delCommTest12";
		argument = "!" + commandName;

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
		expect(result[0]).toBe("!delcommtest12 has been deleted");
	});

	// 1 - 1 - 0 - 0
	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest13";
		commandText = "this is delCommTest13";
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
			"!delcommtest13 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	// 1 - 1 - 0 - 1
	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest14";
		commandText = "this is delCommTest14";
		argument = "!" + commandName;

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
		expect(result[0]).toBe("!delcommtest14 has been deleted");
	});

	// 1 - 1 - 1 - 0
	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "delCommTest15";
		commandText = "this is delCommTest15";
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
			"!delcommtest15 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	// 1 - 1 - 1 - 1
	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "delCommTest16";
		commandText = "this is delCommTest16";
		argument = "!" + commandName;

		await dbSetup(commandName, commandText);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!delcommtest16 has been deleted");
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
