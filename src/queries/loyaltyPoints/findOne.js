const LoyaltyPoints = require("../../models/loyaltypointnew.js");

async function findOne(query, projection, options) {
	return LoyaltyPoints.findOne(query, projection, options).exec();
}

module.exports = findOne;
