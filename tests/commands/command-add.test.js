require("dotenv").config();

const db = require("../../bot-mongoose.js");
const Command = require("../../models/command");

const commands = require("../../bot-commands");
const commandAdd = require("../../commands/command-add");

let isBroadcaster;
let isMod;
let userInfo = {};
let argument = undefined;
let commandLink = commandAdd.command;
const { response } = commandLink.getCommand();

let commandName;
let commandText;

describe("addComm", () => {
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
		commandName = "addCommTest1";
		commandText = "this is addCommTest1";
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
		expect(result[0]).toBe("!addComm command is for Mods only");
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "addCommTest2";
		commandText = "this is addCommTest2";
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
		expect(result[0]).toBe("!addComm command is for Mods only");
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest3";
		commandText = "this is addCommTest3";
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
			"New command must start with '!' - '!addcomm ![newcommand] [command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest4";
		commandText = "this is addCommTest4";
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
			"New command must start with '!' - '!addcomm ![newcommand] [command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest5";
		commandText = "this is addCommTest5";
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
			"New command must start with '!' - '!addcomm ![newcommand] [command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest6";
		commandText = "this is addCommTest6";
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
			"New command must start with '!' - '!addcomm ![newcommand] [command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest7";
		commandText = "this is addCommTest7";
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
			"New command must start with '!' - '!addcomm ![newcommand] [command output]"
		);
	});

	test("ArgumentNotValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest8";
		commandText = "this is addCommTest8";
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
			"New command must start with '!' - '!addcomm ![newcommand] [command output]"
		);
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "addCommTest9";
		commandText = "this is addCommTest9";
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
		expect(result[0]).toBe("!addComm command is for Mods only");
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		commandName = "addCommTest10";
		commandText = "this is addCommTest10";
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
		expect(result[0]).toBe("!addComm command is for Mods only");
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest11";
		commandText = "this is addCommTest11";
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
		expect(result[0]).toBe("!addcommtest11 has been created!");
	});

	test("ArgumentValid_AndIsBroadcasterFalse_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest12";
		commandText = "this is addCommTest12";
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
		expect(result[0]).toBe("!addcommtest12 already exists");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest13";
		commandText = "this is addCommTest13";
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
		expect(result[0]).toBe("!addcommtest13 has been created!");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModFalse_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest14";
		commandText = "this is addCommTest14";
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
		expect(result[0]).toBe("!addcommtest14 already exists");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest15";
		commandText = "this is addCommTest15";
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
		expect(result[0]).toBe("!addcommtest15 has been created!");
	});

	test("ArgumentValid_AndIsBroadcasterTrue_AndIsModTrue_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest16";
		commandText = "this is  addCommTest16";
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
		expect(result[0]).toBe("!addcommtest16 already exists");
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
