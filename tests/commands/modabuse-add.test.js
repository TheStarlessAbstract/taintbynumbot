require("dotenv").config();
const db = require("../../bot-mongoose.js");
const Helper = require("../../classes/helper");
const Title = require("../../models/title");
const pubSubClient = require("../../bot-pubsubclient");
const modAbuseAdd = require("../../commands/modabuse-add");

const helper = new Helper();

let twitchId = process.env.TWITCH_USER_ID;

let userInfo;
let argument;
let commandLink = modAbuseAdd.command;
const { response } = commandLink.getCommand();

describe("addModAbuse", () => {
	jest.setTimeout(6000);
	let apiClient;
	let currentTitle;
	let title;

	let cleanUpList = [];

	beforeAll(async () => {
		db.connectToMongoDB();
		apiClient = await pubSubClient.getApiClient();
		let channel = await apiClient.channels.getChannelInfoById(twitchId);
		currentTitle = channel.title;

		userInfo = {
			userId: 100612361,
			displayName: "TheStarlessAbstract",
		};
	});

	afterAll(async () => {
		await apiClient.channels.updateChannelInfo(twitchId, {
			title: currentTitle,
		});
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
		expect(result[0]).toMatch(/!addModAbuse is for Mods only/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsUndefined_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		title = "This is modAbuseTest2";
		argument = undefined;

		await apiClient.channels.updateChannelInfo(twitchId, {
			title: title,
		});

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(title);
		//Assert
		expect(result[0]).toMatch(/Title added/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsUndefined_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		title = "This is modAbuseTest3";
		argument = undefined;

		await dbSetup(title);
		await apiClient.channels.updateChannelInfo(twitchId, {
			title: title,
		});

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(title);

		//Assert
		expect(result[0]).toMatch(/This Title has already been added/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		title = "This is modAbuseTest4";
		argument = title;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/Title added/);
	});

	test("IsBroadcasterIsFalse_AndIsModIsTrue_AndArgumentIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = false;
		userInfo.isMod = true;
		title = "This is modAbuseTest5";
		argument = title;

		await dbSetup(argument);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This Title has already been added/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsUndefined_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		title = "This is modAbuseTest6";
		argument = undefined;

		await apiClient.channels.updateChannelInfo(twitchId, {
			title: title,
		});

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(title);
		//Assert
		expect(result[0]).toMatch(/Title added/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsUndefined_AndInDatabase_ShouldReturnString", async () => {
		//Assemblej
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		title = "This is modAbuseTest7";
		argument = {};

		await dbSetup(title);
		await apiClient.channels.updateChannelInfo(twitchId, {
			title: title,
		});

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(title);

		//Assert
		expect(result[0]).toMatch(/This Title has already been added/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndNotInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		title = "This is modAbuseTest8";
		argument = title;

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/Title added/);
	});

	test("IsBroadcasterIsTrue_AndIsModIsFalse_AndArgumentIsString_AndInDatabase_ShouldReturnString", async () => {
		//Assemble
		userInfo.isBroadcaster = true;
		userInfo.isMod = false;
		title = "This is modAbuseTest9";
		argument = title;

		await dbSetup(argument);

		//Act
		let result = await response({
			userInfo,
			argument,
		});

		cleanUpList.push(argument);

		//Assert
		expect(result[0]).toMatch(/This Title has already been added/);
	});
});

async function dbSetup(setupTitle) {
	let title = await Title.findOne({ text: setupTitle });

	if (!title) {
		let titleList = await Title.find({});
		await Title.create({
			index: helper.getNextIndex(titleList),
			text: setupTitle,
		});
	}
}

async function dBCleanUp(cleanUpMessages) {
	await Title.deleteMany({ text: { $in: cleanUpMessages } });
}
