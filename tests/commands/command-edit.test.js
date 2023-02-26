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

describe("editComm", () => {
	beforeAll(async () => {
		db.connectToMongoDB();
		await commands.setup();
	});

	beforeEach(() => {
		userInfo = {};
		argument = undefined;
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "editCommTest1";
		commandText = "this is editCommTest1";
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
		expect(result[0]).toBe("!editcomm command is for Mods only");
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "editCommTest2";
		commandText = "this is editCommTest2";
		argument = commandName + " " + commandText;

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
		expect(result[0]).toBe("!editcomm command is for Mods only");
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest3";
		commandText = "this is editCommTest3";
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
			"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest4";
		commandText = "this is editCommTest4";
		argument = commandName + " " + commandText;

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
			"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest5";
		commandText = "this is editCommTest5";
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
			"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest6";
		commandText = "this is editCommTest6";
		argument = commandName + " " + commandText;

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
			"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest7";
		commandText = "this is editCommTest7";
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
			"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest8";
		commandText = "this is editCommTest8";
		argument = commandName + " " + commandText;

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
			"Command being edited starts with '!' - !editComm ![command name] [edited command output]"
		);
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "editCommTest9";
		commandText = "this is editCommTest9";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("!editcomm command is for Mods only");
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "editCommTest10";
		commandText = "this is editCommTest10";
		argument = "!" + commandName + " " + commandText;

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
		expect(result[0]).toBe("!editcomm command is for Mods only");
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editommTest11";
		commandText = "this is editCommTest11";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("No command found by this name !editommtest11");
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "editCommTest12";
		commandText = "this is editCommTest12";
		argument = "!" + commandName + " " + commandText;

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
		expect(result[0]).toBe("!editcommtest12 has been edited!");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest13";
		commandText = "this is editCommTest13";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("No command found by this name !editcommtest13");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "editCommTest14";
		commandText = "this is editCommTest14";
		argument = "!" + commandName + " " + commandText;

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
		expect(result[0]).toBe("!editcommtest14 has been edited!");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest15";
		commandText = "this is editCommTest15";
		argument = "!" + commandName + " " + commandText;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe("No command found by this name !editcommtest15");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "editCommTest16";
		commandText = "this is  editCommTest16";
		argument = "!" + commandName + " " + commandText;

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
		expect(result[0]).toBe("!editcommtest16 has been edited!");
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
