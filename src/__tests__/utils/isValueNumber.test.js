const { isValueNumber } = require("../../utils");

describe("isValueNumber", () => {
	describe("When value not a number", () => {
		test("Result should be false", async () => {
			//Assemble
			value = undefined;

			//Act
			let result = isValueNumber(value);

			expect(result).toBeFalsy();
		});
	});

	describe("When value is a number", () => {
		test("Result should be true", async () => {
			//Assemble
			value = 1;

			//Act
			let result = isValueNumber(value);

			expect(result).toBeTruthy();
		});
	});

	describe("When value is a number as a string", () => {
		test("Result should be true", async () => {
			//Assemble
			value = "1";

			//Act
			let result = isValueNumber(value);

			expect(result).toBeTruthy();
		});
	});
});
