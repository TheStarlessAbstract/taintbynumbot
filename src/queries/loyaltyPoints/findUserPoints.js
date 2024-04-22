const LoyaltyPoints = require("../../models/loyaltypointnew.js");

async function findUserPoints(query, projection, options) {
	return LoyaltyPoints.findOne(query, projection, options).exec();
}

module.exports = { findUserPoints };
