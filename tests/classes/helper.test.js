const Helper = require("../../classes/helper");
const helper = new Helper();

test("getCommandArgumentKey_argumentIsSingleWord_andArgurmentIndexIs1_shouldReturnEmptyString", () => {
	//Assemble
	let config = {};
	config.argument = "Rose";
	// //Act
	let value = helper.getCommandArgumentKey(config, 1);
	//Assert
	expect(value).toBe("");
});

test("getCommandArgumentKey_argumentIsSingleWord_andArgurmentIndexIs2_shouldReturnRose", () => {
	//Assemble
	let config = {};
	config.argument = "Rose";
	// //Act
	let value = helper.getCommandArgumentKey(config, 0);
	//Assert
	expect(value).toBe("Rose");
});
