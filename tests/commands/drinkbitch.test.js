const drinkBitch = require("../../commands/drinkbitch");

let validversions = [
	{
		description: "Makes Starless drink booze",
		usage: "!drinkbitch",
		usableBy: "users",
		cost: "500 Tainty Points",
		active: true,
	},
];

let invalidversions = [];

let currentTime;
let lastTimeSet;
let currentCooldown;

test("isStreamer_WhereUserIsStreamer_ShouldReturnTrue", () => {
	//Assemble
	let config = {};
	config.isBroadcaster = true;
	//Act
	let value = drinkBitch.isStreamer(config);
	//Assert
	expect(value).toBe(true);
});

test("isStreamer_WhereUserIsNotStreamer_ShouldReturnFalse", () => {
	//Assemble
	let config = {};
	config.isBroadcaster = false;
	//Act
	let value = drinkBitch.isStreamer(config);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_VersionsPackIsUndefined_ShouldReturnFalse", () => {
	//Assemble

	//Act
	let value = drinkBitch.isVersionActive(undefined, 0);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_VersionsPackIsEmpty_ShouldReturnFalse", () => {
	//Assemble

	//Act
	let value = drinkBitch.isVersionActive(invalidversions, 0);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_WhereIndexIsOutOfBounds_ShouldReturnFalse", () => {
	//Assemble

	//Act
	let value = drinkBitch.isVersionActive(validversions, 100);
	//Assert
	expect(value).toBe(false);
});

test("isVersionActive_WhereIndexIsValid_AndSelectedVersionIsActive_ShouldReturnTrue", () => {
	//Assemble

	//Act
	let value = drinkBitch.isVersionActive(validversions, 0);
	//Assert
	expect(value).toBe(true);
});

test("isVersionActive_WhereIndexIsValid_AndSelectedVersionIsNotActive_ShouldReturnFalse", () => {
	//Assemble

	//Act
	validversions[0].active = false;
	let value = drinkBitch.isVersionActive(validversions, 0);
	//Assert
	expect(value).toBe(false);
});

describe("isCooldownPassed", () => {
	// Applies only to tests in this describe block
	beforeEach(() => {
		return initializeCooldownVariables();
	});

	test("WhereCurrentTimeLessThanLastTimeSet_ShouldReturnFalse", () => {
		//Assemble
		currentTime = 1676052800000;

		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereLastTimeSetGreaterThanCurrentTime_ShouldReturnFalse", () => {
		//Assemble
		lastTimeSet = new Date(1676052830000);
		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentCooldownIsNegative_ShouldReturnFalse", () => {
		//Assemble
		currentCooldown = -5000;

		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentTimeIsString_ShouldReturnFalse", () => {
		//Assemble
		currentTime = "string";

		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereLastTimeSetIsString_ShouldReturnFalse", () => {
		//Assemble
		lastTimeSet = "string";
		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentCooldownIsString_ShouldReturnFalse", () => {
		//Assemble
		currentCooldown = "string";

		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentCooldownsIsUndefined_ShouldReturnFalse", () => {
		//Assemble
		currentTime = undefined;
		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentCooldownsIsUndefined_ShouldReturnFalse", () => {
		//Assemble
		lastTimeSet = undefined;
		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentCooldownsIsUndefined_ShouldReturnFalse", () => {
		//Assemble
		currentCooldown = undefined;
		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentTimeValid_AndLastTimeSetValid_AndCurrentCooldownIsEmptyString_ShouldReturnFalse", () => {
		//Assemble
		currentCooldown = "";
		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(false);
	});

	test("WhereCurrentTimeValid_AndLastTimeSetValid_AndCurrentCooldownValid_ShouldReturnFalse", () => {
		//Assemble

		//Act
		let value = drinkBitch.isCooldownPassed(
			currentTime,
			lastTimeSet,
			currentCooldown
		);
		//Assert
		expect(value).toBe(true);
	});
});

function initializeCooldownVariables() {
	currentTime = new Date(1676052820000);
	lastTimeSet = new Date(1676052810000);
	currentCooldown = 5000;
}
