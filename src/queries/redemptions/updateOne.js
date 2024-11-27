const Redemption = require("../../models/redemptions");

async function updateOne(filter, update, options) {
	return Redemption.updateOne(filter, update, options).exec();
}

module.exports = updateOne;
