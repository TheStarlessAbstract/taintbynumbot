const CardGame = require("../../models/cardgame");

async function findOne(query, projection, options) {
	return await CardGame.findOne(query, projection, options).exec();
}

module.exports = findOne;
