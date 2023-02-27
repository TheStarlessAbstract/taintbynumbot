require("dotenv").config();

const db = require("../../bot-mongoose.js");
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
	beforeAll(async () => {
		db.connectToMongoDB();
		await commands.setup();
	});

	afterAll(async () => {
		await db.disconnectFromMongoDB();
	});
	//0-0-0-0 - //0-0-0-1 - //0-0-1-0 - //0-0-1-1 - //0-0-2-0 - //0-0-2-1
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

	//0-1-0-0 - //0-1-0-1
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest2";
		commandText = "this is addCommTest2";
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
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	//0-1-1-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentValid_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest3";
		commandText = "this is addCommTest3";
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
		expect(result[0]).toBe("!addcommtest3 has been created!");
	});

	//0-1-1-1
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentValid_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "addCommTest4";
		commandText = "this is addCommTest4";
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
		expect(result[0]).toBe("!addcommtest4 already exists");
	});

	//0-1-2-0 - //0-1-2-1
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

	//1-0-0-0 - //1-0-0-1
	test("IsBroadcasterTrue_AnsdIsModFalse_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest6";
		commandText = "this is addCommTest6";
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
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	//1-0-1-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest7";
		commandText = "this is addCommTest7";
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
		expect(result[0]).toBe("!addcommtest7 has been created!");
	});

	//1-0-1-1
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "addCommTest8";
		commandText = "this is addCommTest8";
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
		expect(result[0]).toBe("!addcommtest8 already exists");
	});

	//1-0-2-0 - //1-0-2-1
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

	//1-1-0-0 - //1-1-0-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "addCommTest10";
		commandText = "this is addCommTest10";
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
			"New Command must start with '!' - !addComm ![newcommand] [command output]"
		);
	});

	//1-1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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

	//1-1-1-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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

	//1-1-2-0 - //1-1-2-1
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
			"To add a Command use !addComm ![command name] [command text]"
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
