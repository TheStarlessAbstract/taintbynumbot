const messageEdit = require("../../commands/messages-edit");

test("a", () => {
	//Assemble
	let config = {};
	config.argument = "Rose";
	//Act
	let value = messageEdit.getCommandArgumentKey(config, 1);
	//Assert
	expect(value).toBe(undefined);
});
