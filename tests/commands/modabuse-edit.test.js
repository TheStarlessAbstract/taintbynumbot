require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Title = require("../../models/title");
const modAbuseEdit = require("../../commands/modabuse-edit");

let userInfo;
let argument;
let titleIndex;
let titleText;

let commandLink = modAbuseEdit.command;
const { response } = commandLink.getCommand();

describe("editModAbuse", () => {
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
		expect(result[0]).toMatch(/!editModAbuse is for Mods only/);
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
		expect(result[0]).toBe(
			"To edit a ModAbuse, use !editModAbuse [index] [updated text]"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringNotStartsWithModAbuseId_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		titleIndex = "editModAbuse3";
		argument = titleIndex;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editModAbuse [index] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithModAbuseId_AndStringNotHaveModAbuseText_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		titleIndex = "1104";
		argument = titleIndex;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editModAbuse [index] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithModAbuseId_AndStringHasModAbuseText_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		titleIndex = "1105";
		titleUpdatedText = "5This is editModAbuseTest";
		argument = titleIndex + " " + titleUpdatedText;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No ModAbuse 1105 found/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithModAbuseId_AndStringHasModAbuseText_AndModAbuseIdInDatabase_AndModAbuseTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		titleIndex = "1106";
		titleText = "This is editModAbuseTest6";
		titleUpdatedText = titleText;
		argument = titleIndex + " " + titleUpdatedText;

		await dbSetup(titleIndex, titleText);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(titleIndex);
		//Assert
		expect(result[0]).toMatch(
			/ModAbuse 1106 already says: This is editModAbuseTest6/
		);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentString_AndStringStartsWithModAbuseId_AndStringHasModAbuseText_AndModAbuseIdInDatabase_AndModAbuseTextIsUnique_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		titleIndex = "1107";
		titleText = "This is editModAbuseTest7";
		titleUpdatedText = "7This is editModAbuseTest";
		argument = titleIndex + " " + titleUpdatedText;

		await dbSetup(titleIndex, titleText);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(titleIndex);

		//Assert
		expect(result[0]).toMatch(
			/ModAbuse 1107 has been updated - it previously was: This is editModAbuseTest7/
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
		expect(result[0]).toBe(
			"To edit a ModAbuse, use !editModAbuse [index] [updated text]"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringNotStartsWithModAbuseId_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		titleIndex = "editModAbuse9";
		argument = titleIndex;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editModAbuse [index] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithModAbuseId_AndStringNotHaveModAbuseText_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		titleIndex = "1110";
		argument = titleIndex;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toBe(
			"!editModAbuse [index] [updated text] - !editModAbuse 69 It's all about the booty"
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithModAbuseId_AndStringHasModAbuseText_AndModAbuseIdNotInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		titleIndex = "1111";
		titleUpdatedText = "11This is editModAbuseTest";
		argument = titleIndex + " " + titleUpdatedText;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		//Assert
		expect(result[0]).toMatch(/No ModAbuse 1111 found/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithModAbuseId_AndStringHasModAbuseText_AndModAbuseIdInDatabase_AndModAbuseTextNotUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		titleIndex = "1112";
		titleText = "This is editModAbuseTest12";
		titleUpdatedText = titleText;
		argument = titleIndex + " " + titleUpdatedText;

		await dbSetup(titleIndex, titleText);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(titleIndex);

		//Assert
		expect(result[0]).toMatch(
			/ModAbuse 1112 already says: This is editModAbuseTest12/
		);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentString_AndStringStartsWithModAbuseId_AndStringHasModAbuseText_AndModAbuseIdInDatabase_AndModAbuseTextIsUnique_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		titleIndex = "1113";
		titleText = "This is editModAbuseTest13";
		titleUpdatedText = "13This is editModAbuseTest";
		argument = titleIndex + " " + titleUpdatedText;

		await dbSetup(titleIndex, titleText);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(titleIndex);

		//Assert
		expect(result[0]).toMatch(
			/ModAbuse 1113 has been updated - it previously was: This is editModAbuseTest13/
		);
	});
});

async function dbSetup(setupIndex, setupTitle) {
	let title = await Title.findOne({ text: setupTitle });

	if (!title) {
		await Title.create({
			index: setupIndex,
			text: setupTitle,
		});
	}
}

async function dBCleanUp(cleanUpMessages) {
	await Title.deleteMany({ index: { $in: cleanUpMessages } });
}
