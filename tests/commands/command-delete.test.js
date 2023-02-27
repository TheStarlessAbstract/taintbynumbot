require("dotenv").config();

const db = require("../../bot-mongoose.js");
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

describe.skip("delComm", () => {
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
		expect(result[0]).toBe("!delComm Command is for Mods only");
	});

	//0-1-0-0 - //0-1-0-1
	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest2";
		commandText = "this is delCommTest2";
		argument = commandName;

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
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
		);
	});

	//0-1-1-0
	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentValid_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest3";
		commandText = "this is delCommTest3";
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
			"!delcommtest3 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	//0-1-1-1
	test("IsBroadcasterFalse_AndAndIsModTrue_AndArgumentValid_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		commandName = "delCommTest4";
		commandText = "this is delCommTest4";
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
		expect(result[0]).toBe("!delcommtest4 has been deleted");
	});

	//0-1-2-0 - //0-1-2-1
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

	//1-0-0-0 - //1-0-0-1
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest6";
		commandText = "this is delCommTest6";
		argument = commandName;

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
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
		);
	});

	//1-0-1-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest7";
		commandText = "this is delCommTest7";
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
			"!delcommtest7 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	//1-0-1-1
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentValid_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		commandName = "delCommTest8";
		commandText = "this is delCommTest8";
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
		expect(result[0]).toBe("!delcommtest8 has been deleted");
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
		expect(result[0]).toBe("To delete a Command, use !delComm ![command name]");
	});
	//1-1-0-0 - //1-1-0-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentNotValid_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		commandName = "delCommTest10";
		commandText = "this is delCommTest10";
		argument = commandName;

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
			"To delete a Command, command name must start with '!' - !delComm ![command name]"
		);
	});

	//1-1-1-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndCommandNotInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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

		await dBCleanUp(commandName);

		//Assert
		expect(result[0]).toBe(
			"!delcommtest11 doesn't look to be a command, are you sure you spelt it right, dummy?!"
		);
	});

	//1-1-1-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentValid_AndCommandInDb_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
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
		expect(result[0]).toBe("To delete a Command, use !delComm ![command name]");
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
