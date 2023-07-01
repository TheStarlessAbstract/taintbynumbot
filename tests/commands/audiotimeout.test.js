const audio = require("../../bot-audio");
const audioTimeout = require("../../commands/audiotimeout");

let argument;
let userInfo = {};
let commandLink = audioTimeout.command;
const { response } = commandLink.getCommand();

describe.skip("audioTimeout", () => {
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

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("!audioTimeout command is for Mods only");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(1);

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		argument = "this will fail";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout to on or off use !audioTimeout"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionOneActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
		//Assemble
		argument = "this will fail";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionOneActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "3";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionOneActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "-3";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		commandLink.setVersionActive(0);

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To stop the audioTimeout, use !audioTimeout without a number of seconds"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndAllVersionsActive_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: false,
			isMod: true,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterTrue_AndIsModIsFalse_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
		//Assemble
		argument = "this will fail";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "3";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "-3";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To stop the audioTimeout, use !audioTimeout without a number of seconds"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndNoVersionsActive_ShouldReturnUndefined", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);
		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionZeroActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(1);

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionZeroActive_AndArgumentString_ShouldReturnString", async () => {
		//Assemble
		argument = "this will fail";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(1);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout to on or off use !audioTimeout"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionOneActive_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionOneActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
		//Assemble
		argument = "this will fail";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionOneActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "3";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionOneActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "-3";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnUndefined", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndVersionOneActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		commandLink.setVersionActive(0);

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To stop the audioTimeout, use !audioTimeout without a number of seconds"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentUndefined_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = undefined;
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been stopped");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringAsText_ShouldReturnString", async () => {
		//Assemble
		argument = "this will fail";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To set audioTimeout length use !audioTimeout [number]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringAsPositiveNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "3";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringAsNegativeNumber_ShouldReturnString", async () => {
		//Assemble
		argument = "-3";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To use set the timeout length use postive number of seconds - !audiotimeout 10"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutFalse_ShouldReturnString", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBeUndefined();
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndAllVersionsActive_AndArgumentString_AndStringIsZero_AndAudioTimeoutTrue_ShouldReturnString", async () => {
		//Assemble
		argument = "0";
		userInfo = {
			isBroadcaster: true,
			isMod: false,
		};

		audio.setAudioTimeout();

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"To stop the audioTimeout, use !audioTimeout without a number of seconds"
		);
	});
});
