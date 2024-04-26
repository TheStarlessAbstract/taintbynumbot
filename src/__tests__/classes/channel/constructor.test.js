const Channel = require("../../../classes/channel.js");

describe("Channel", () => {
	test("should instantiate Channel with id and name", () => {
		// Assemble
		const channelId = 1;
		const channelName = "Test Channel";

		// Act
		const channel = new Channel(channelId, channelName);

		// Assert
		expect(channel.id).toBe(channelId);
		expect(channel.name).toBe(channelName);
		expect(channel.messageCount).toBe(0);
		expect(channel.isLive).toBe(false);
		expect(channel.lastIsLiveUpdate).toBe(false);
		expect(channel.timedMessagesInterval).toBe(60000);
		expect(channel.commands).toEqual({});
	});
});
