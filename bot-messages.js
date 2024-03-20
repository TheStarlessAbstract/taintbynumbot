const Message = require("./models/message");

async function get(twitchId) {
	return await Message.find({ twitchId });
}

exports.get = get;
