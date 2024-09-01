const LoyaltyPoints = require("../../models/loyaltypointnew");

async function bulkWrite(ops, options, callback) {
	return LoyaltyPoints.bulkWrite(ops, options, callback);
}

module.exports = bulkWrite;
