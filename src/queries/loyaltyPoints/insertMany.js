const LoyaltyPoint = require("../../models/loyaltypointnew");

async function insertMany(doc, options) {
	return await LoyaltyPoint.insertMany(doc, options);
}

module.exports = insertMany;
