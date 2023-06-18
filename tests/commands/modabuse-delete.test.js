require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Title = require("../../models/title");
const modAbuseDelete = require("../../commands/modabuse-delete");

let isBroadcaster;
let isMod;
let userInfo;
let argument;
let commandLink = modAbuseDelete.command;
const { response } = commandLink.getCommand();

describe.skip("delModAbuse", () => {
	let cleanUpList = [];

	beforeAll(async () => {
		db.connectToMongoDB();

		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	});

	afterAll(async () => {
		await dBCleanUp(cleanUpList);
		await db.disconnectFromMongoDB();
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
		expect(result[0]).toMatch(/!delModAbuse is for Mods only/);
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
		expect(result[0]).toBe("To delete a ModAbuse, use !delModAbuse ![index]");
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = false;
		isMod = true;
		argument = "delAbuseTest3";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delModAbuse [index] - index is a number - !delModAbuse 69"
		);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		argument = "1004";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No ModAbuse 1004 found/);
	});

	test("IsBroadcasterFalse_AndIsModTrue_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = false;
		isMod = true;
		title = "This is delAbuseTest5";
		argument = "1005";

		await dbSetup(argument, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(title);

		//Assert
		expect(result[0]).toMatch(
			/ModAbuse  deleted - 1005 was: This is delAbuseTest5/
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
		expect(result[0]).toBe("To delete a ModAbuse, use !delModAbuse ![index]");
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemblej
		isBroadcaster = true;
		isMod = false;
		argument = "delAbuseTest7";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delModAbuse [index] - index is a number - !delModAbuse 69"
		);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		argument = "1008";

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No ModAbuse 1008 found/);
	});

	test("IsBroadcasterTrue_AndIsModFalse_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		isBroadcaster = true;
		isMod = false;
		title = "This is delAbuseTest9";
		argument = "1009";

		await dbSetup(argument, title);

		//Act
		let result = await response({
			isBroadcaster,
			isMod,
			userInfo,
			argument,
		});

		cleanUpList.push(title);

		//Assert
		expect(result[0]).toMatch(
			/ModAbuse  deleted - 1009 was: This is delAbuseTest9/
		);
	});
});

async function dbSetup(index, setupTitle) {
	await Title.create({
		index: index,
		text: setupTitle,
	});
}

async function dBCleanUp(cleanUpMessages) {
	await Title.deleteMany({ text: { $in: cleanUpMessages } });
}
