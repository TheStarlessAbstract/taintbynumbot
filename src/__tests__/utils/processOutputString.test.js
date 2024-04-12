const processOutputString = require("../../utils/processOutputString.js");

describe("processOutputString()", () => {
	test("should replace all keys in the outputString with their corresponding values from the map", () => {
		// Assemble
		const outputString = "Hello {name}, your age is {age}";
		const map = new Map();
		map.set("name", "John");
		map.set("age", 30);

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBe("Hello John, your age is 30");
	});

	test("should return the same outputString when there are no keys", () => {
		// Assemble
		const outputString = "Hello World";
		const map = new Map();

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBe("Hello World");
	});

	test("should return undefined when the outputString is not a string", () => {
		// Assemble
		const outputString = 123;
		const map = new Map();

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when the map is not a Map object", () => {
		// Assemble
		const outputString = "Hello {name}";
		const map = {};

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return undefined when given an empty outputString and map", () => {
		// Assemble
		const outputString = "";
		const map = new Map();

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBeUndefined();
	});

	test("should return the same outputString when there are no matching keys in the map", () => {
		// Assemble
		const outputString = "Hello, {name}!";
		const map = new Map();

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBe(outputString);
	});

	test("should replace all occurrences of duplicate keys with their corresponding values", () => {
		// Assemble
		const outputString =
			"Hello {name}, welcome to {location}. {name}, enjoy your stay!";
		const map = new Map();
		map.set("name", "John");
		map.set("location", "New York");

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBe(
			"Hello John, welcome to New York. John, enjoy your stay!"
		);
	});

	test("should replace all occurrences of keys with special characters with their corresponding values", () => {
		// Assemble
		const outputString = "Hello {name}! How are you {time}?";
		const map = new Map();
		map.set("name", "John");
		map.set("time", "today");

		// Act
		const result = processOutputString(outputString, map);

		// Assert
		expect(result).toBe("Hello John! How are you today?");
	});
});
