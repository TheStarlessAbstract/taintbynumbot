const audio = require("../../bot-audio");
const audioTimeout = require("../../commands/audiotimeout");

let isBroadcaster;
let isMod;
let userInfo = {};
let commandLink = audioTimeout.command;
const { response } = commandLink.getCommand();

describe("audioTimeout", () => {
	beforeEach(() => {
		userInfo = {};

		if (audio.getAudioTimeout()) {
			audio.setAudioTimeout();
		}
	});

	test("IsBroadcasterFalse_AndIsModFalse_AndArgumentUndefined_ShouldReturnString", async () => {
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
		expect(result[0]).toBe("!audioTimeout command is for Mods only");
	});

	test("IsBroadcasterFalse_AndIsModFalse_AndArgumentNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = false;
		argument = "3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!audioTimeout command is for Mods only");
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
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentZeroAsString_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "0";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentNegativeNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "-3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = 3;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "this will fail";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentBoolean_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = true;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
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
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentZeroAsString_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "0";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentNegativeNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "-3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = 3;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "this will fail";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentBoolean_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = true;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
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
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentZeroAsString_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "0";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(undefined);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentNegativeNumberAsString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "-3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = 3;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = "this will fail";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});

	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentBoolean_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = true;

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!audioTimeout - to start or stop the audio timeout, or !audioTimeout [number] to set the length of the audio timeout"
		);
	});
});
