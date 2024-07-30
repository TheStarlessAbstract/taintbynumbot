const Users = require("../../models/usernew");

async function updateOne(filter, update, options) {
	return Users.updateOne(filter, update, options).exec();
}

module.exports = updateOne;
