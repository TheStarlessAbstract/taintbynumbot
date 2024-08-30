const LoyaltyPoints = require("../../models/loyaltypointnew");

async function find(filter, projection, options) {
	return LoyaltyPoints.find(filter, projection, options);
}

module.exports = find;
