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

	//0-0
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

	//0-1-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsUndefined_ShouldReturnString", async () => {
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

	//0-1-1-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndNoPrefix_ShouldReturnString", async () => {
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

	//0-1-1-1-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndNoCommandName_ShouldReturnString", async () => {
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

	//0-1-1-1-1-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndNoCommandText_ShouldReturnString", async () => {
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

	//0-1-1-1-1-1-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndHasCommandText_AndNotInCommandList_ShouldReturnString", async () => {
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

	//0-1-1-1-1-1-1
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndHasCommandText_AndInCommandList_ShouldReturnString", async () => {
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

	//1-0-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsUndefined_ShouldReturnString", async () => {
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

	//1-0-1-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndNoPrefix_ShouldReturnString", async () => {
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

	//1-0-1-1-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndHasPrefix_AndNoCommandName_ShouldReturnString", async () => {
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

	//1-0-1-1-1-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndNoCommandText_ShouldReturnString", async () => {
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

	//1-0-1-1-1-1-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndHasCommandText_AndNotInCommandList_ShouldReturnString", async () => {
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

	//1-0-1-1-1-1-1
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndHasCommandText_AndInCommandList_ShouldReturnString", async () => {
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

	//1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentIsUndefined_ShouldReturnString", async () => {
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
			"To add a Command use !addComm ![command name] [command text]"
		);
	});

	//1-1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentIsString_AndNoPrefix_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest15";
		commandText = "this is addCommTest15";
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

	//1-1-1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndNoCommandName_AndNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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

	//1-1-1-1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndNoCommandText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest17";
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

	//1-1-1-1-1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndCommandText_AndNotInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest18";
		commandText = "this is addCommTest18";
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
		expect(result[0]).toBe("!addcommtest18 has been created!");
	});

	//1-1-1-1-1-1-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentIsString_AndHasPrefix_AndHasCommandName_AndCommandText_AndInCommandList_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest19";
		commandText = "this is addCommTest19";
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
		expect(result[0]).toBe("!addcommtest19 already exists");
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
