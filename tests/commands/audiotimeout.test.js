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

	//0-0-0-0 - //0-0-0-1 - //0-0-1-0 - //0-0-1-1 - //0-0-2-0 - //0-0-2-1 - //0-0-3-0 - //0-0-3-1 - //0-0-4-0 - //0-0-4-1
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
		expect(result[0]).toBe("!audioTimeout command is for Mods only");
	});

	//0-1-0-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
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

	//0-1-0-1
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;

		audio.setAudioTimeout();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	//0-1-1-0
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

	//0-1-2-0
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

	//0-1-3-0
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

	//0-1-4-0
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentZeroAsString_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBeUndefined();
	});

	//0-1-4-1
	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentZeroAsString_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "0";

		audio.setAudioTimeout();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To stop the audioTimeout, use !audioTimeout without a number of seconds"
		);
	});

	//1-0-0-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
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

	//1-0-0-1
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;

		audio.setAudioTimeout();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	//1-0-1-0
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

	//1-0-2-0
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

	//1-0-3-0
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

	//1-0-4-0
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentZeroAsString_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBeUndefined();
	});

	//1-0-4-1
	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentZeroAsString_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "0";

		audio.setAudioTimeout();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To stop the audioTimeout, use !audioTimeout without a number of seconds"
		);
	});

	//1-1-0-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
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

	//1-1-0-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = true;
		argument = undefined;

		audio.setAudioTimeout();

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	//1-1-1-0
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

	//1-1-2-0
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

	//1-1-3-0
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

	//1-1-4-0
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentZeroAsString_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBeUndefined();
	});

	//1-1-4-1
	test("IsBroadcasterTrue_AndIsModTrue_AndArgumentZeroAsString_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
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
		expect(result[0]).toBeUndefined();
	});
});
