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

		for (let i = 0; i < 2; i++) {
			if (!commandLink.getVersionActivity(i)) {
				commandLink.setVersionActive(i);
			}
		}
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
		expect(result[0]).toBe("!audioTimeout command is for Mods only");
	});

	test("IsBroadcasterIsFalse_AndIsModTrue_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "this will fail";
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout to on or off use !audioTimeout"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = undefined;
		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionOneActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "this will fail";
		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionOneActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "3";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionOneActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "-3";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "0";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "0";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
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
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnString", async () => {
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

	test("IsBroadcasterFalse_AndIsModTrue_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;
		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;
		commandLink.setVersionActive(1);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "this will fail";
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout to on or off use !audioTimeout"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = undefined;
		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionOneActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "this will fail";
		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionOneActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "3";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionOneActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "-3";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "0";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "0";
		commandLink.setVersionActive(0);

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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndAllVersionsActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndAllVersionsActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
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
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModFalse_AndAllVersionsActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndAllVersionsActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnString", async () => {
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

	test("IsBroadcasterIsTrue_AndIsModFalse_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
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
});
