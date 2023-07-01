require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Title = require("../../models/title");
const modAbuseDelete = require("../../commands/modabuse-delete");

let userInfo;
let argument;
let commandLink = modAbuseDelete.command;
const { response } = commandLink.getCommand();

describe("delModAbuse", () => {
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

	test("IsBroadcasterIsFalse_AndIsModIsFalse_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/!delModAbuse is for Mods only/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("To delete a ModAbuse, use !delModAbuse ![index]");
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "delAbuseTest3";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delModAbuse [index] - index is a number - !delModAbuse 69"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		argument = "1004";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No ModAbuse 1004 found/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		title = "This is delAbuseTest5";
		argument = "1005";

		await dbSetup(argument, title);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(title);

		//Assert
		expect(result[0]).toMatch(
			/ModAbuse  deleted - 1005 was: This is delAbuseTest5/
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentUndefined_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = undefined;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe("To delete a ModAbuse, use !delModAbuse ![index]");
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNotNumber_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "delAbuseTest7";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!delModAbuse [index] - index is a number - !delModAbuse 69"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringIsNumber_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		argument = "1008";

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No ModAbuse 1008 found/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringIsNumber_AndModAbuseIdInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		title = "This is delAbuseTest9";
		argument = "1009";

		await dbSetup(argument, title);

		//Act
		let result = await response({
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
