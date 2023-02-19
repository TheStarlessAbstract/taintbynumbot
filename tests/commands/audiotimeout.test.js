const audioTimeout = require("../../commands/audiotimeout");
const audio = require("../../bot-audio");

let isBroadcaster = true;
let isModUp = true;
let userInfo = {};
let argument = undefined;
let commandLink = audioTimeout.command;
const { response } = commandLink.getCommand();

describe("audioTimeout", () => {
	// Applies only to tests in this describe block
	beforeEach(() => {
		isBroadcaster = true;
		isModUp = true;
		userInfo = {};
		argument = undefined;

		if (audio.getAudioTimeout()) {
			audio.setAudioTimeout();
		}
	});

	test("IsBroadcasterIsTrue_AndIsModUpIsTrue_AndArgumentIsUndefined_ShouldReturnStartedString", async () => {
		//Assemble

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsBroadcasterIsFalse_ShouldReturnStartedString", async () => {
		//Assemble
		isBroadcaster = false;

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("IsModUpIsFalse_ShouldReturnStartedString", async () => {
		//Assemble
		isModUp = false;

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("Bot audio timeout has been started");
	});

	test("ArgumentIsANumber_ShouldReturnTimeString", async () => {
		//Assemble
		argument = "3";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"Bot audio timeout has been started, and set to 3 seconds"
		);
	});

	test("ArgumentIsString_ShouldReturnCorrectUsageString", async () => {
		//Assemble
		argument = "this will fail";

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"'!audioTimeout' - to start or stop the timeout, or '!audioTimeout {number} to set the length of the timeout'"
		);
	});

	test("ArgumentIsBoolean_ShouldReturnCorrectUsageString", async () => {
		//Assemble
		argument = true;

		//Act
		let result = await response({
			isBroadcaster,
			isModUp,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"'!audioTimeout' - to start or stop the timeout, or '!audioTimeout {number} to set the length of the timeout'"
		);
	});
});
