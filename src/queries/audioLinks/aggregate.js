const AudioLink = require("../../models/audiolink");

async function aggregate(pipline) {
	return await AudioLink.aggregate(pipline).exec();
}

module.exports = aggregate;
