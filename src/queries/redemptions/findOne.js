const Redemption = require("../../models/redemptions");

async function findOne(query, projection, options) {
	return Redemption.findOne(query, projection, options).exec();
}

module.exports = findOne;
