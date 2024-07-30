const AudioLink = require("../../models/audiolink");

async function findOne(query, projection, options) {
	return await AudioLink.findOne(query, projection, options).exec();
}

module.exports = findOne;
